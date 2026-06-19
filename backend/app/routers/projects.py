from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.dependencies.auth import get_current_user, get_optional_user
from app.services.project_service import project_service
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.utils.response import success_response, paginated_response
from typing import Optional

router = APIRouter()


# ── Stats (must be before /{project_id} to avoid route conflict) ─────────────

@router.get("/stats")
async def get_platform_stats():
    """Live platform statistics: total projects, developers, categories."""
    stats = project_service.get_platform_stats()
    return success_response(data=stats, message="Stats fetched successfully.")


# ── My Projects ───────────────────────────────────────────────────────────────

@router.get("/my")
async def get_my_projects(current_user: dict = Depends(get_current_user)):
    """Get all projects belonging to the authenticated user."""
    projects = project_service.get_my_projects(current_user["user_id"])
    return success_response(data=projects, message="Your projects fetched successfully.")


# ── Projects by Developer ─────────────────────────────────────────────────────

@router.get("/user/{username}")
async def get_projects_by_username(username: str):
    """Get published projects for a developer by their username."""
    projects = project_service.get_projects_by_username(username)
    return success_response(data=projects, message="Developer projects fetched.")


# ── List All Projects ─────────────────────────────────────────────────────────

@router.get("")
async def list_projects(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=50),
):
    """List all published projects with pagination."""
    result = project_service.get_projects_paginated(page=page, limit=limit)
    return paginated_response(
        data=result["data"],
        total=result["total"],
        page=page,
        limit=limit,
    )


# ── Create Project ────────────────────────────────────────────────────────────

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_project(
    body: ProjectCreate,
    current_user: dict = Depends(get_current_user),
):
    """Create a new project (authenticated)."""
    project = project_service.create_project(
        user_id=current_user["user_id"],
        data=body.model_dump(),
    )
    return success_response(data=project, message="Project created successfully.")


# ── Get Single Project ────────────────────────────────────────────────────────

@router.get("/{project_id}")
async def get_project(
    project_id: str,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Get a single project by ID. Also increments view count."""
    project = project_service.get_project_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )
    # Increment view count asynchronously (non-blocking)
    project_service.increment_view_count(project_id)
    return success_response(data=project, message="Project fetched successfully.")


# ── Update Project ────────────────────────────────────────────────────────────

@router.put("/{project_id}")
async def update_project(
    project_id: str,
    body: ProjectUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update a project. Only the owner can update."""
    updated = project_service.update_project(
        project_id=project_id,
        user_id=current_user["user_id"],
        data=body.model_dump(exclude_none=True),
    )
    return success_response(data=updated, message="Project updated successfully.")


# ── Delete Project ────────────────────────────────────────────────────────────

@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
async def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a project. Only the owner can delete."""
    project_service.delete_project(
        project_id=project_id,
        user_id=current_user["user_id"],
    )
    return success_response(data=None, message="Project deleted successfully.")
