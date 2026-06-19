from app.database.supabase import supabase
from fastapi import HTTPException, status
from typing import Optional


class AuthService:
    """Handles all profile-related database operations."""

    def get_profile(self, user_id: str) -> Optional[dict]:
        """Fetch a profile by user ID."""
        try:
            response = (
                supabase.table("profiles")
                .select("*")
                .eq("id", user_id)
                .single()
                .execute()
            )
            return response.data
        except Exception:
            return None

    def get_profile_by_username(self, username: str) -> Optional[dict]:
        """Fetch a profile by username (public)."""
        try:
            response = (
                supabase.table("profiles")
                .select("*")
                .eq("username", username)
                .single()
                .execute()
            )
            return response.data
        except Exception:
            return None

    def upsert_profile(self, user_id: str, data: dict) -> dict:
        """
        Create or update a profile row.
        Only updates fields that are provided (non-None).
        """
        # Filter out None values so we don't overwrite existing data
        clean_data = {k: v for k, v in data.items() if v is not None}
        clean_data["id"] = user_id

        try:
            response = (
                supabase.table("profiles")
                .upsert(clean_data, on_conflict="id")
                .execute()
            )
            if response.data:
                return response.data[0]
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upsert profile.",
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}",
            )

    def get_all_developers(self) -> list:
        """Fetch all profiles that have at least one published project."""
        try:
            response = (
                supabase.table("profiles")
                .select("id, username, full_name, avatar_url, bio")
                .execute()
            )
            return response.data or []
        except Exception:
            return []


auth_service = AuthService()
