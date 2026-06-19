from supabase import Client
from app.database.supabase import supabase


class SupabaseService:
    """
    Thin wrapper around the supabase-py client.
    Provides a shared interface for all service classes.
    """

    def __init__(self, client: Client = None):
        self.client = client or supabase

    def table(self, table_name: str):
        return self.client.table(table_name)

    def storage(self):
        return self.client.storage

    def auth(self):
        return self.client.auth


# Shared singleton instance
supabase_service = SupabaseService()
