"""
Inference for MedicalPlan-Xray (API v2).

Artifacts (created by `python -m src.train fit`):
  models/plan_model.joblib     fitted sklearn pipeline
  models/plan_model_meta.json  class order, CV scores, versions
  models/reference_stats.json  aggregate training-data context
"""
import json
from pathlib import Path

import joblib

from app.features import (  # noqa: F401  (re-exported for tests/tools)
    create_features,
    derive_salary_bracket,
    prepare_input,
    range_warnings,
)
from app.insights import build_insights

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BASE_DIR / "models"

model = joblib.load(MODEL_DIR / "plan_model.joblib")
meta = json.loads((MODEL_DIR / "plan_model_meta.json").read_text(encoding="utf-8"))
reference = json.loads((MODEL_DIR / "reference_stats.json").read_text(encoding="utf-8"))

# predict_proba column i corresponds to CLASSES[i] (LabelEncoder order).
CLASSES = meta["classes"]


def model_summary() -> dict:
    cv = meta["cv"]
    depth = None
    params = meta.get("best_params") or {}
    if "model__max_depth" in params:
        depth = params["model__max_depth"]
    kind = meta["model_class"]
    if kind == "DecisionTreeClassifier":
        kind = f"Decision tree (depth {depth})" if depth else "Decision tree"
    return {
        "model_name": meta["model_name"],
        "model_type": kind,
        "model_version": meta["model_version"],
        "trained_at": meta["trained_at"],
        "training_rows": meta["data"]["rows"],
        "cv_folds": cv["folds"],
        "cv_macro_f1": cv["macro_f1"],
        "cv_accuracy": cv["accuracy"],
        "cv_recall_by_plan": {
            plan: vals["recall"] for plan, vals in cv["per_class"].items()
        },
        "accuracy_ceiling": meta["label_noise_ceiling"]["max_accuracy"],
    }


def predict_medical_plan(customer_data):

    df, derived = prepare_input(customer_data)

    warnings = range_warnings(customer_data)

    probabilities = model.predict_proba(df)[0]

    probability_dict = {
        plan: round(float(p), 4) for plan, p in zip(CLASSES, probabilities)
    }

    # Take the label from the same probability vector so the two can never disagree.
    predicted_plan = max(probability_dict, key=probability_dict.get)

    insights = build_insights(model, meta, reference, customer_data, df, probability_dict)

    return {
        "prediction": predicted_plan,
        "probabilities": probability_dict,
        "warnings": warnings,
        "derived": derived,
        "insights": insights,
    }
