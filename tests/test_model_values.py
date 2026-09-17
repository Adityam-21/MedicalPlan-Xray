"""
Value-level tests for the inference path the API actually uses
(backend/app/predictor.py). These catch label-mapping regressions,
which shape-only tests cannot.
"""
import math

import pytest

from app.predictor import class_mapping, model, predict_medical_plan
from known_cases import CASE_IDS, KNOWN_CASES

PLANS = {"High", "Low", "Medium"}


def test_model_classes_are_encoded_integers():
    assert [int(c) for c in model.classes_] == [0, 1, 2]


def test_class_mapping_matches_labelencoder_order():
    # LabelEncoder sorts labels alphabetically.
    expected = dict(enumerate(sorted(PLANS)))
    saved = {int(k): v for k, v in class_mapping.items()}
    assert saved == expected == {0: "High", 1: "Low", 2: "Medium"}


@pytest.mark.parametrize("name,expected,customer", KNOWN_CASES, ids=CASE_IDS)
def test_known_rows_predict_expected_plan(name, expected, customer):
    result = predict_medical_plan(customer)
    assert result["prediction"] == expected


@pytest.mark.parametrize("name,expected,customer", KNOWN_CASES, ids=CASE_IDS)
def test_prediction_is_the_most_probable_plan(name, expected, customer):
    result = predict_medical_plan(customer)
    probs = result["probabilities"]
    assert set(probs) == PLANS
    assert math.isclose(sum(probs.values()), 1.0, abs_tol=0.01)
    assert result["prediction"] == max(probs, key=probs.get)


def test_high_risk_profile_is_confidently_high():
    _, _, customer = KNOWN_CASES[-1]
    result = predict_medical_plan(customer)
    assert result["probabilities"]["High"] > 0.5


def test_out_of_range_expenditure_produces_warning():
    _, _, customer = KNOWN_CASES[0]
    result = predict_medical_plan({**customer, "annual_expenditure_inr": 900000})
    assert any("expenditure" in w.lower() for w in result["warnings"])
