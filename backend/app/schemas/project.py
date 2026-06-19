from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProjectCreate(BaseModel):
    title: str
    description: str
    category: str
    technologies: Optional[List[str]] = []
    demo_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    screenshots: Optional[List[str]] = []
    status: Optional[str] = "published"


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[List[str]] = None
    demo_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    screenshots: Optional[List[str]] = None
    status: Optional[str] = None


class AuthorInfo(BaseModel):
    id: Optional[str] = None
    full_name: Optional[str] = None
    username: Optional[str] = None
    avatar_url: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    category: str
    technologies: Optional[List[str]] = []
    demo_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    screenshots: Optional[List[str]] = []
    status: str
    view_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    # Joined author info (optional)
    author_name: Optional[str] = None
    author_username: Optional[str] = None
    author_avatar: Optional[str] = None


class StatsResponse(BaseModel):
    total_projects: int
    total_developers: int
    total_categories: int
