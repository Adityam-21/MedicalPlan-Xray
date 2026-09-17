"""
Thin re-export so notebooks keep working.
The real definitions live in backend/app/features.py (single source of truth).
"""
import sys
from pathlib import Path

_BACKEND = Path(__file__).resolve().parents[1] / "backend"
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from app.features import create_features, derive_salary_bracket  # noqa: E402,F401
