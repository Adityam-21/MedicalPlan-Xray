import joblib
import pandas as pd
from pathlib import Path

# ----------------------------
# Feature Engineering
# ----------------------------

def create_features(df):
    df = df.copy()

    df["expense_ratio"] = (
        df["annual_expenditure_inr"] /
        df["total_income_inr"]
    )

    df["savings"] = (
        df["total_income_inr"] -
        df["annual_expenditure_inr"]
    )

    df["income_per_member"] = (
        df["total_income_inr"] /
        df["family_members"]
    )

    df["expenditure_per_member"] = (
        df["annual_expenditure_inr"] /
        df["family_members"]
    )

    return df


# ----------------------------
# Load Model
# ----------------------------

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BASE_DIR / "models"

model = joblib.load(MODEL_DIR / "insurance_model.pkl")
class_mapping = joblib.load(MODEL_DIR / "class_mapping.pkl")


# ----------------------------
# Prediction
# ----------------------------

def predict_medical_plan(customer_data):

    df = pd.DataFrame([customer_data])

    warnings = []

    if df["total_income_inr"].iloc[0] > 5000000:
        warnings.append("Income is outside training range.")

    if df["annual_expenditure_inr"].iloc[0] > 416505:
        warnings.append("Annual expenditure is outside training range.")

    df = create_features(df)

    prediction = model.predict(df)[0]

    probabilities = model.predict_proba(df)[0]

    predicted_plan = class_mapping[prediction]

    probability_dict = {
        class_mapping[i]: round(float(prob), 4)
        for i, prob in zip(model.classes_, probabilities)
    }

    return {
        "prediction": predicted_plan,
        "probabilities": probability_dict,
        "warnings": warnings,
    }