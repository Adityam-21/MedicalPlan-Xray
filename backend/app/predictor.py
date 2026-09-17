import joblib
from pathlib import Path

from app.features import (  # noqa: F401  (re-exported for tests/tools)
    create_features,
    derive_salary_bracket,
    prepare_input,
    range_warnings,
)

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

    df, derived = prepare_input(customer_data)

    warnings = range_warnings(customer_data)

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
        "derived": derived,
    }
