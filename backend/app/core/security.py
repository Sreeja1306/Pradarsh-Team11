from fastapi import HTTPException, status
import jwt as pyjwt
from jwt import PyJWKClient
from app.core.config import settings
from functools import lru_cache

# ── JWKS client (cached — only fetched once per process) ────────────────────

@lru_cache()
def _get_jwks_client() -> PyJWKClient:
    """
    Returns a cached PyJWKClient pointed at Supabase's JWKS endpoint.
    Used to verify new ES256 / RS256 tokens issued by Supabase.
    """
    jwks_url = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
    return PyJWKClient(jwks_url, cache_keys=True)


# ── Token verification ───────────────────────────────────────────────────────

def verify_jwt(token: str) -> dict:
    """
    Verify a Supabase JWT token.

    Strategy:
    1. Try HS256 with the shared JWT secret (legacy Supabase tokens).
    2. Try ES256 / RS256 via Supabase's JWKS endpoint (new Supabase tokens).

    Both paths fully verify the signature — no unverified fallback.
    Raises HTTP 401 if neither verification succeeds.
    """
    # ── 1. Try HS256 (legacy tokens) ────────────────────────────────────────
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

    # ── 2. Try ES256 / RS256 via JWKS (new Supabase tokens) ─────────────────
    try:
        client = _get_jwks_client()
        signing_key = client.get_signing_key_from_jwt(token)
        payload = pyjwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256", "ES256"],
            options={"verify_aud": False},
        )
        return payload
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
