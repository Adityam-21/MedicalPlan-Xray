import logging

from fastapi import APIRouter, HTTPException

from app.config import API_VERSION
from app.database import log_prediction
from app.predictor import model_summary, predict_medical_plan
from app.schemas import PredictionRequest

logger = logging.getLogger(__name__)

router = APIRouter()

DISCLAIMER = (
    "Educational demo trained on a small synthetic dataset. "
    "Not insurance, financial or medical advice."
)

IGNORED_FIELDS = {"gender", "salary_bracket"}


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/model")
def model_info():
    return {"api_version": API_VERSION, **model_summary(), "disclaimer": DISCLAIMER}


@router.post("/predict")
def predict(request: PredictionRequest):

    customer_data = request.model_dump(exclude=IGNORED_FIELDS)

    try:
        result = predict_medical_plan(customer_data)
    except Exception:
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while generating prediction.",
        )

    confidence = round(max(result["probabilities"].values()) * 100, 2)

    notices = []
    sent = request.model_dump(include=IGNORED_FIELDS, exclude_none=True)
    if sent:
        notices.append(
            f"Ignored deprecated field(s): {', '.join(sorted(sent))}. "
            "They are not used by the v2 model."
        )

    # Logging must never break a prediction; log_prediction handles its own errors.
    log_prediction({
        **customer_data,
        "salary_bracket": result["derived"]["salary_bracket"],
        "predicted_plan": result["prediction"],
        "confidence": confidence,
    })

    return {
        "status": "success",
        "prediction": {
            "recommended_plan": result["prediction"],
            "confidence": confidence,
            "probabilities": {
                plan: round(prob * 100, 2)
                for plan, prob in result["probabilities"].items()
            },
        },
        "warnings": result["warnings"],
        "notices": notices,
        "derived": result["derived"],
        "inputs": customer_data,
        "insights": result["insights"],
        "metadata": {"api_version": API_VERSION, **model_summary()},
        "disclaimer": DISCLAIMER,
    }
