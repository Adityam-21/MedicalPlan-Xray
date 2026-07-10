from supabase import create_client, Client

import logging

from app.config import (
    SUPABASE_URL,
    SUPABASE_KEY
)

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

logger = logging.getLogger(__name__)


def log_prediction(data: dict):
    try:
        response = (
            supabase
            .table("prediction_logs")
            .insert(data)
            .execute()
        )
        return response

    except Exception as e:
        logger.exception("Failed to log prediction to Supabase.")
        return None