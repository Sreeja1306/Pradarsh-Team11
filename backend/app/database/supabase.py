from supabase import create_client, Client
from app.core.config import settings
from functools import lru_cache


@lru_cache()
def get_supabase_client() -> Client:
    """
    Returns a cached Supabase service-role client.
    Service role bypasses RLS — only use server-side.
    """
    return create_client(
        settings.supabase_url,
        settings.supabase_service_key,
    )


# Module-level client for convenience
supabase: Client = get_supabase_client()
