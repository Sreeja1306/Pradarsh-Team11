from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies.auth import get_current_user
from app.services.auth_service import auth_service
from app.schemas.auth import UpdateProfileRequest
from app.utils.response import success_response, error_response

router = APIRouter()


@router.get("/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Get the authenticated user's profile."""
    user_id = current_user["user_id"]
    profile = auth_service.get_profile(user_id)

    if not profile:
        # Profile may not exist yet (e.g. first OAuth login before trigger fires)
        # Auto-create a minimal profile
        profile = auth_service.upsert_profile(user_id, {
            "id": user_id,
            "full_name": "",
            "username": "",
        })

    return success_response(data=profile, message="Profile fetched successfully.")


@router.put("/me")
async def update_my_profile(
    body: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update the authenticated user's profile."""
    user_id = current_user["user_id"]

    updated = auth_service.upsert_profile(user_id, body.model_dump())
    return success_response(data=updated, message="Profile updated successfully.")


@router.get("/profile/{username}")
async def get_public_profile(username: str):
    """Get a developer's public profile by username."""
    profile = auth_service.get_profile_by_username(username)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Developer '{username}' not found.",
        )

    return success_response(data=profile, message="Profile fetched successfully.")
