# Imports:

import joblib
import pandas as pd

from pathlib import Path
from src.feature_engineering import create_features

# Load Artifacts:

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BASE_DIR / "models"

model = joblib.load(MODEL_DIR / "insurance_model.pkl")

class_mapping = joblib.load(MODEL_DIR / "class_mapping.pkl")

# Predicition Function:


def predict_medical_plan(customer_data):

    df = pd.DataFrame([customer_data])

    # For handling OOD inputs:

    warnings = []

    if df["total_income_inr"].iloc[0] > 5000000:
        warnings.append("Income is outside training range.")

    if df["annual_expenditure_inr"].iloc[0] > 416505:
        warnings.append("Annual expenditure is outside training range.")

    # FE

    df = create_features(df)

    prediction = model.predict(df)[0]

    probabilities = model.predict_proba(df)[0]

    predicted_plan = class_mapping[prediction]

    prob_dict = {
        class_mapping[i]: round(float(prob), 4)
        for i, prob in zip(model.classes_, probabilities)
    }

    return {
        "prediction": predicted_plan,
        "probabilities": prob_dict,
        "warnings": warnings,
    }
