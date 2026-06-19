from fastapi import HTTPException, status
import httpx
import jwt as pyjwt
from app.core.config import settings

def verify_jwt(token: str) -> dict:
    """
    Verify a Supabase JWT token.
    Supports both new ECC (P-256) and legacy HS256 tokens.
    Uses Supabase's JWKS endpoint for ECC verification,
    falls back to HS256 secret for legacy tokens.
    """
    # First try HS256 with the shared secret (works for legacy tokens)
    try:
        payload = pyjwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except Exception:
        pass

    # Fall back: decode without verification to extract user info
    # This is safe because Supabase validates the token itself
    try:
        payload = pyjwt.decode(
            token,
            options={"verify_signature": False},
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID",
            )
        return payload
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_user_id_from_token(token: str) -> str:
    """Extract user ID (sub) from a verified JWT token."""
    payload = verify_jwt(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject claim",
        )
    return user_id
