from pathlib import Path

from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

MODEL_NAME = os.getenv("MODEL_NAME")
if MODEL_NAME is None:
    raise ValueError("MODEL_NAME not found in .env")

MODEL_VERSION = os.getenv("MODEL_VERSION")

API_TITLE = os.getenv("API_TITLE")
API_VERSION = os.getenv("API_VERSION")