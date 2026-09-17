"""
Thin re-export so notebooks keep working.
The API's real inference code lives in backend/app/predictor.py.
"""
import sys
from pathlib import Path

_BACKEND = Path(__file__).resolve().parents[1] / "backend"
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from app.predictor import predict_medical_plan  # noqa: E402,F401
