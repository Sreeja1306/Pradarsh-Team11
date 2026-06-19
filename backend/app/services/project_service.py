from app.database.supabase import supabase
from fastapi import HTTPException, status
from typing import Optional, List


class ProjectService:
    """All project-related database operations."""

    # ── Create ──────────────────────────────────────────────────────────────

    def create_project(self, user_id: str, data: dict) -> dict:
        """Create a new project owned by user_id."""
        project_data = {**data, "user_id": user_id}
        # Remove None values
        project_data = {k: v for k, v in project_data.items() if v is not None}

        try:
            response = supabase.table("projects").insert(project_data).execute()
            if response.data:
                return response.data[0]
            raise HTTPException(status_code=500, detail="Failed to create project.")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ── Read ─────────────────────────────────────────────────────────────────

    def get_project_by_id(self, project_id: str) -> Optional[dict]:
        """Fetch a single project with author info."""
        try:
            response = (
                supabase.table("projects")
                .select("*, profiles(id, full_name, username, avatar_url, github_url, linkedin_url, website_url, bio)")
                .eq("id", project_id)
                .single()
                .execute()
            )
            if response.data:
                project = response.data
                # Flatten author info
                profile = project.pop("profiles", {}) or {}
                project["author_name"] = profile.get("full_name", "")
                project["author_username"] = profile.get("username", "")
                project["author_avatar"] = profile.get("avatar_url", "")
                project["author_github"] = profile.get("github_url", "")
                project["author_linkedin"] = profile.get("linkedin_url", "")
                project["author_website"] = profile.get("website_url", "")
                project["author_bio"] = profile.get("bio", "")
                return project
            return None
        except Exception:
            return None

    def get_projects_paginated(self, page: int = 1, limit: int = 12) -> dict:
        """Fetch published projects with pagination and author info."""
        offset = (page - 1) * limit
        try:
            # Count
            count_response = (
                supabase.table("projects")
                .select("id", count="exact")
                .eq("status", "published")
                .execute()
            )
            total = count_response.count or 0

            # Data
            response = (
                supabase.table("projects")
                .select("*, profiles(full_name, username, avatar_url)")
                .eq("status", "published")
                .order("created_at", desc=True)
                .range(offset, offset + limit - 1)
                .execute()
            )

            projects = []
            for p in (response.data or []):
                profile = p.pop("profiles", {}) or {}
                p["author_name"] = profile.get("full_name", "")
                p["author_username"] = profile.get("username", "")
                p["author_avatar"] = profile.get("avatar_url", "")
                projects.append(p)

            return {"data": projects, "total": total}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_my_projects(self, user_id: str) -> List[dict]:
        """Fetch all projects (any status) belonging to user_id."""
        try:
            response = (
                supabase.table("projects")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            return response.data or []
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_projects_by_username(self, username: str) -> List[dict]:
        """Fetch published projects for a developer identified by username."""
        try:
            # Get profile id from username
            profile_resp = (
                supabase.table("profiles")
                .select("id")
                .eq("username", username)
                .single()
                .execute()
            )
            if not profile_resp.data:
                return []

            user_id = profile_resp.data["id"]
            response = (
                supabase.table("projects")
                .select("*")
                .eq("user_id", user_id)
                .eq("status", "published")
                .order("created_at", desc=True)
                .execute()
            )
            return response.data or []
        except Exception:
            return []

    # ── Update ───────────────────────────────────────────────────────────────

    def update_project(self, project_id: str, user_id: str, data: dict) -> dict:
        """Update a project. Raises 403 if user is not the owner."""
        # Ownership check
        existing = self.get_project_by_id(project_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Project not found.")
        if existing["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="You do not own this project.")

        clean_data = {k: v for k, v in data.items() if v is not None}
        try:
            response = (
                supabase.table("projects")
                .update(clean_data)
                .eq("id", project_id)
                .execute()
            )
            if response.data:
                return response.data[0]
            raise HTTPException(status_code=500, detail="Update failed.")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ── Delete ───────────────────────────────────────────────────────────────

    def delete_project(self, project_id: str, user_id: str) -> bool:
        """Delete a project. Raises 403 if user is not the owner."""
        existing = self.get_project_by_id(project_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Project not found.")
        if existing["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="You do not own this project.")

        try:
            supabase.table("projects").delete().eq("id", project_id).execute()
            return True
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ── Increment view count ──────────────────────────────────────────────────

    def increment_view_count(self, project_id: str):
        """Increment view_count by 1 (fire and forget)."""
        try:
            supabase.rpc("increment_view_count", {"project_id": project_id}).execute()
        except Exception:
            pass  # Non-critical — don't fail the request

    # ── Stats ─────────────────────────────────────────────────────────────────

    def get_platform_stats(self) -> dict:
        """Return live platform statistics."""
        try:
            projects_resp = (
                supabase.table("projects")
                .select("id", count="exact")
                .eq("status", "published")
                .execute()
            )
            total_projects = projects_resp.count or 0

            # Count distinct developers with at least one published project
            developers_resp = (
                supabase.table("projects")
                .select("user_id")
                .eq("status", "published")
                .execute()
            )
            unique_devs = len(set(p["user_id"] for p in (developers_resp.data or [])))

            # Count distinct categories used
            categories_resp = (
                supabase.table("projects")
                .select("category")
                .eq("status", "published")
                .execute()
            )
            unique_categories = len(set(p["category"] for p in (categories_resp.data or [])))

            return {
                "total_projects": total_projects,
                "total_developers": unique_devs,
                "total_categories": unique_categories,
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


project_service = ProjectService()
