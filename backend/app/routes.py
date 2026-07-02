from fastapi import APIRouter

from backend.app.schemas import PredictionRequest
from backend.app.predictor import predict_medical_plan

from fastapi import HTTPException

from backend.app.config import MODEL_NAME, MODEL_VERSION

from backend.app.database import log_prediction

router = APIRouter()


@router.post("/predict")
def predict(request: PredictionRequest):

    try:
        customer_data = request.model_dump()

        result = predict_medical_plan(customer_data)
        
        confidence = max(result["probabilities"].values()) * 100

        prediction_record = {
        **customer_data,
        "predicted_plan": result["predicted_plan"],
        "confidence": round(confidence, 2)
        }
        
        log_prediction(prediction_record)
        
        return {
            "status": "success",
            "prediction": {
                "recommended_plan": result["predicted_plan"],
                "confidence": round(confidence, 2),
                "probabilities": {
                    key: round(value * 100, 2)
                    for key, value in result["probabilities"].items()
                },
            },
            "metadata": {"model_name": MODEL_NAME, "model_version": MODEL_VERSION},
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Internal server error while generating prediction."
        )
