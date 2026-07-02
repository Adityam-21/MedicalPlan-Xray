from backend.app.database import supabase

response = (
    supabase
    .table("prediction_logs")
    .select("*")
    .execute()
)

print(response.data)