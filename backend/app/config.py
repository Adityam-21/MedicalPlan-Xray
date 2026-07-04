from pathlib import Path

from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")
MODEL_VERSION = os.getenv("MODEL_VERSION")
API_TITLE = os.getenv("API_TITLE", "MedicalPlan-Xray API")
API_VERSION = os.getenv("API_VERSION", "1.0.0")

required_env_vars = {
    "SUPABASE_URL": SUPABASE_URL,
    "SUPABASE_KEY": SUPABASE_KEY,
    "MODEL_NAME": MODEL_NAME,
}

missing = [name for name, value in required_env_vars.items() if not value]

if missing:
    raise ValueError(f"Missing required environment variable(s): {', '.join(missing)}")
