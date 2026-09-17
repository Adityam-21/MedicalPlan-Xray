import logging

from fastapi import APIRouter, HTTPException

from app.config import MODEL_NAME, MODEL_VERSION
from app.database import log_prediction
from app.predictor import predict_medical_plan
from app.schemas import PredictionRequest

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/predict")
def predict(request: PredictionRequest):

    try:
        customer_data = request.model_dump()

        result = predict_medical_plan(customer_data)

    except Exception:
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while generating prediction.",
        )

    confidence = round(max(result["probabilities"].values()) * 100, 2)

    # Logging must never break a prediction; log_prediction handles its own errors.
    log_prediction({
        **customer_data,
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
        "metadata": {"model_name": MODEL_NAME, "model_version": MODEL_VERSION},
    }
