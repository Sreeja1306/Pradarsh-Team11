from fastapi import APIRouter, Depends, UploadFile, File
from typing import List
from app.dependencies.auth import get_current_user
from app.services.storage_service import storage_service
from app.utils.response import success_response

router = APIRouter()


@router.post("/thumbnail")
async def upload_thumbnail(
    file: UploadFile = File(..., description="Project thumbnail image (JPEG, PNG, WebP, GIF — max 5MB)"),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload a single project thumbnail.
    Returns the public URL and storage path.
    """
    result = await storage_service.upload_thumbnail(
        user_id=current_user["user_id"],
        file=file,
    )
    return success_response(data=result, message="Thumbnail uploaded successfully.")


@router.post("/screenshots")
async def upload_screenshots(
    files: List[UploadFile] = File(..., description="Screenshot images (up to 10, max 5MB each)"),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload multiple project screenshots (max 10).
    Returns list of public URLs and storage paths.
    """
    result = await storage_service.upload_screenshots(
        user_id=current_user["user_id"],
        files=files,
    )
    return success_response(data=result, message=f"{result['count']} screenshot(s) uploaded successfully.")
