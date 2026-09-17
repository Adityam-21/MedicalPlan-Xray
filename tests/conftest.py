"""
Shared pytest setup for MedicalPlan-Xray.

- Puts the repo root and backend/ on sys.path so tests import the SAME
  modules the API uses (app.predictor, app.routes, ...).
- Provides placeholder env vars so app.config can be imported in CI.
  Real values from .env are kept if already set (setdefault).
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
for p in (ROOT, ROOT / "backend"):
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

# Placeholders only. Supabase calls are mocked in tests/test_api.py.
os.environ.setdefault("SUPABASE_URL", "https://placeholder.supabase.co")
os.environ.setdefault("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidGVzdCJ9.placeholder")
os.environ.setdefault("MODEL_NAME", "test-model")
os.environ.setdefault("MODEL_VERSION", "test")
