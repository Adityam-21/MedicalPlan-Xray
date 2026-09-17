import logging

from supabase import Client, create_client

from app.config import SUPABASE_KEY, SUPABASE_URL

logger = logging.getLogger(__name__)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def log_prediction(data: dict):
    """Insert one prediction record. Failures are logged, never raised."""
    try:
        return supabase.table("prediction_logs").insert(data).execute()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Supabase logging failed: %s: %s", type(exc).__name__, exc)
        return None
