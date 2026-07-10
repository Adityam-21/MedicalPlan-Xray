import traceback

from fastapi import APIRouter

from app.schemas import PredictionRequest
from app.predictor import predict_medical_plan

from fastapi import HTTPException

from app.config import MODEL_NAME, MODEL_VERSION

from app.database import log_prediction

router = APIRouter()


@router.post("/predict")
def predict(request: PredictionRequest):

    try:
        customer_data = request.model_dump()

        result = predict_medical_plan(customer_data)

        confidence = max(result["probabilities"].values()) * 100

        prediction_record = {
            **customer_data,
            "predicted_plan": result["prediction"],
            "confidence": round(confidence, 2),
        }

        log_prediction(prediction_record)

        return {
            "status": "success",
            "prediction": {
                "recommended_plan": result["prediction"],
                "confidence": round(confidence, 2),
                "probabilities": {
                    key: round(value * 100, 2)
                    for key, value in result["probabilities"].items()
                },
            },
            "metadata": {"model_name": MODEL_NAME, "model_version": MODEL_VERSION},
        }

    except Exception:
        raise HTTPException(
        status_code=500,
        detail="Internal server error while generating prediction."
    )
