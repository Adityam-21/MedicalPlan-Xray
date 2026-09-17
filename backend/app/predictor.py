import joblib
import pandas as pd
from pathlib import Path

# ----------------------------
# Training ranges
# ----------------------------
# Min/max of each numeric input in data/processed/clean_data.csv (980 rows).
# Inputs outside these ranges are still scored, but the model has never
# seen such values, so the response carries a warning.

TRAINING_RANGES = {
    "age": (18, 75, "Age"),
    "family_members": (1, 6, "Family size"),
    "total_income_inr": (151934, 4997509, "Income"),
    "annual_expenditure_inr": (5000, 416505, "Annual expenditure"),
}


def range_warnings(customer_data: dict) -> list[str]:
    warnings = []
    for field, (low, high, label) in TRAINING_RANGES.items():
        value = customer_data.get(field)
        if value is None:
            continue
        if value < low or value > high:
            warnings.append(
                f"{label} is outside training range ({low:,}–{high:,}); "
                "treat this prediction with extra caution."
            )
    return warnings


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

    warnings = range_warnings(customer_data)

    df = create_features(pd.DataFrame([customer_data]))

    prediction = model.predict(df)[0]

    probabilities = model.predict_proba(df)[0]

    predicted_plan = class_mapping[int(prediction)]

    probability_dict = {
        class_mapping[int(i)]: round(float(prob), 4)
        for i, prob in zip(model.classes_, probabilities)
    }

    return {
        "prediction": predicted_plan,
        "probabilities": probability_dict,
        "warnings": warnings,
    }
