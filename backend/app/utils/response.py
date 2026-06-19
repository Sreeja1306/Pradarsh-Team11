from typing import Any, Optional


def success_response(data: Any = None, message: str = "Success") -> dict:
    """Standard success response wrapper."""
    return {
        "success": True,
        "message": message,
        "data": data,
    }


def error_response(message: str, code: int = 400) -> dict:
    """Standard error response wrapper."""
    return {
        "success": False,
        "message": message,
        "data": None,
    }


def paginated_response(
    data: list,
    total: int,
    page: int,
    limit: int,
    message: str = "Success",
) -> dict:
    """Standard paginated response wrapper."""
    return {
        "success": True,
        "message": message,
        "data": data,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit if limit > 0 else 1,
            "has_next": (page * limit) < total,
            "has_prev": page > 1,
        },
    }
