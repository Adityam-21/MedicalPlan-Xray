from supabase import create_client, Client

from backend.app.config import (
    SUPABASE_URL,
    SUPABASE_KEY
)

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

def log_prediction(data: dict):
    response = (
        supabase
        .table("prediction_logs")
        .insert(data)
        .execute()
    )

    return response