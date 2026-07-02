from pathlib import Path

import joblib
import pandas as pd

from src.feature_engineering import create_features

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_DIR = BASE_DIR / "models"

model = joblib.load(
    MODEL_DIR / "insurance_model.pkl"
)

class_mapping = joblib.load(
    MODEL_DIR / "class_mapping.pkl"
)

def predict_medical_plan(customer_data: dict):
    
    df = pd.DataFrame([customer_data])
    
    df = create_features(df)
    
    prediction = model.predict(df)[0]

    probabilities = model.predict_proba(df)[0]
    
    predicted_plan = class_mapping[prediction]
    
    probability_dict = {
    class_mapping[i]: round(float(prob), 4)
    for i, prob in zip(
        model.classes_,
        probabilities
    )
}
    return {
    "predicted_plan": predicted_plan,
    "probabilities": probability_dict
}