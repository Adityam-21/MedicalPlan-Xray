import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")

# Versioned in code, not in .env, so the reported version always matches the code.
API_VERSION = "2.0.0"
API_TITLE = os.getenv("API_TITLE", "MedicalPlan-Xray API")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

missing = [
    name for name, value in {"SUPABASE_URL": SUPABASE_URL, "SUPABASE_KEY": SUPABASE_KEY}.items()
    if not value
]
if missing:
    raise ValueError(f"Missing required environment variable(s): {', '.join(missing)}")
