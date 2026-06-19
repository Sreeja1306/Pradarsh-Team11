from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_jwt
from typing import Optional

bearer_scheme = HTTPBearer(auto_error=True)
optional_bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """
    Dependency for protected routes.
    Extracts and verifies the Bearer JWT from the Authorization header.
    Returns the decoded payload dict with at minimum {"sub": user_id}.
    Raises HTTP 401 if token is missing or invalid.
    """
    token = credentials.credentials
    payload = verify_jwt(token)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing user identifier.",
        )

    return {
        "user_id": user_id,
        "email": payload.get("email", ""),
        "payload": payload,
    }


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_bearer_scheme),
) -> Optional[dict]:
    """
    Dependency for public routes that optionally accept an authenticated user.
    Returns user dict if token present and valid, else None.
    """
    if credentials is None:
        return None
    try:
        token = credentials.credentials
        payload = verify_jwt(token)
        user_id = payload.get("sub")
        if not user_id:
            return None
        return {
            "user_id": user_id,
            "email": payload.get("email", ""),
            "payload": payload,
        }
    except HTTPException:
        return None
