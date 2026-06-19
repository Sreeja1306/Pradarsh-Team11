from fastapi import APIRouter, Query
from app.services.search_service import search_service
from app.utils.response import paginated_response
from typing import Optional, List

router = APIRouter()


@router.get("")
async def search_projects(
    q: Optional[str] = Query(default=None, description="Search by project name or developer name"),
    category: Optional[str] = Query(default=None, description="Filter by category (exact match)"),
    technologies: Optional[List[str]] = Query(default=None, description="Filter by technologies (any match)"),
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=12, ge=1, le=50, description="Results per page"),
):
    """
    Search and filter published projects.

    - **q**: searches project title AND developer full name
    - **category**: exact category match (e.g. "AI & Machine Learning")
    - **technologies**: one or more tech tags (e.g. technologies=React&technologies=Python)
    - **page** / **limit**: pagination
    """
    result = search_service.search_projects(
        q=q,
        category=category,
        technologies=technologies,
        page=page,
        limit=limit,
    )

    return paginated_response(
        data=result["data"],
        total=result["total"],
        page=page,
        limit=limit,
        message="Search results fetched successfully.",
    )
