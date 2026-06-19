import uuid
import os
from fastapi import HTTPException, UploadFile
from app.database.supabase import supabase
from app.core.config import settings
from typing import List

# Allowed image MIME types
ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


class StorageService:
    """Handles file uploads to Supabase Storage."""

    def _validate_image(self, file: UploadFile):
        """Validate file type."""
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type '{file.content_type}'. Allowed: JPEG, PNG, WebP, GIF.",
            )

    def _get_extension(self, filename: str, content_type: str) -> str:
        """Get file extension from filename or content type."""
        if filename and "." in filename:
            return filename.rsplit(".", 1)[-1].lower()
        type_map = {
            "image/jpeg": "jpg",
            "image/jpg": "jpg",
            "image/png": "png",
            "image/webp": "webp",
            "image/gif": "gif",
        }
        return type_map.get(content_type, "jpg")

    def _get_public_url(self, bucket: str, path: str) -> str:
        """Build public URL for a Supabase Storage object."""
        return f"{settings.supabase_url}/storage/v1/object/public/{bucket}/{path}"

    async def upload_thumbnail(self, user_id: str, file: UploadFile) -> dict:
        """
        Upload a project thumbnail to the project-thumbnails bucket.
        Stores under {user_id}/{uuid}.{ext}
        Returns { url, path, filename }
        """
        self._validate_image(file)

        ext = self._get_extension(file.filename or "", file.content_type)
        unique_name = f"{uuid.uuid4().hex}.{ext}"
        storage_path = f"{user_id}/{unique_name}"

        contents = await file.read()

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 5MB.",
            )

        try:
            supabase.storage.from_("project-thumbnails").upload(
                path=storage_path,
                file=contents,
                file_options={"content-type": file.content_type, "upsert": "true"},
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Upload failed: {str(e)}",
            )

        public_url = self._get_public_url("project-thumbnails", storage_path)
        return {
            "url": public_url,
            "path": storage_path,
            "filename": unique_name,
        }

    async def upload_screenshots(self, user_id: str, files: List[UploadFile]) -> dict:
        """
        Upload multiple screenshots to the project-screenshots bucket.
        Stores each under {user_id}/{uuid}.{ext}
        Returns { urls: [...], paths: [...], count: N }
        """
        if not files:
            raise HTTPException(status_code=400, detail="No files provided.")

        if len(files) > 10:
            raise HTTPException(status_code=400, detail="Maximum 10 screenshots allowed.")

        urls = []
        paths = []

        for file in files:
            self._validate_image(file)

            ext = self._get_extension(file.filename or "", file.content_type)
            unique_name = f"{uuid.uuid4().hex}.{ext}"
            storage_path = f"{user_id}/{unique_name}"

            contents = await file.read()

            if len(contents) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"File '{file.filename}' is too large. Maximum 5MB per file.",
                )

            try:
                supabase.storage.from_("project-screenshots").upload(
                    path=storage_path,
                    file=contents,
                    file_options={"content-type": file.content_type, "upsert": "true"},
                )
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Upload failed for '{file.filename}': {str(e)}",
                )

            public_url = self._get_public_url("project-screenshots", storage_path)
            urls.append(public_url)
            paths.append(storage_path)

        return {
            "urls": urls,
            "paths": paths,
            "count": len(urls),
        }

    def delete_file(self, bucket: str, path: str):
        """Delete a file from a storage bucket."""
        try:
            supabase.storage.from_(bucket).remove([path])
        except Exception:
            pass  # Non-critical


storage_service = StorageService()
