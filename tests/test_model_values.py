"""
Value-level tests for the v2 inference path (backend/app/predictor.py).
"""
import math

import pytest

from app.predictor import (
    CLASSES,
    derive_salary_bracket,
    meta,
    model,
    model_summary,
    predict_medical_plan,
)
from known_cases import CASE_IDS, KNOWN_CASES

PLANS = {"High", "Low", "Medium"}


def test_class_order_matches_labelencoder():
    # LabelEncoder sorts labels alphabetically; predict_proba follows this order.
    assert CLASSES == sorted(PLANS) == ["High", "Low", "Medium"]
    assert [int(c) for c in model.classes_] == [0, 1, 2]


def test_model_does_not_use_gender_or_user_id():
    inputs = meta["input_features"]["numeric"] + meta["input_features"]["categorical"]
    assert "gender" not in inputs
    assert "user_id" not in inputs


@pytest.mark.parametrize("name,expected,customer", KNOWN_CASES, ids=CASE_IDS)
def test_known_rows_predict_expected_plan(name, expected, customer):
    assert predict_medical_plan(customer)["prediction"] == expected


@pytest.mark.parametrize("name,expected,customer", KNOWN_CASES, ids=CASE_IDS)
def test_prediction_is_the_most_probable_plan(name, expected, customer):
    result = predict_medical_plan(customer)
    probs = result["probabilities"]
    assert set(probs) == PLANS
    assert math.isclose(sum(probs.values()), 1.0, abs_tol=0.01)
    assert result["prediction"] == max(probs, key=probs.get)


def test_high_risk_profile_is_confidently_high():
    _, _, customer = KNOWN_CASES[-1]
    assert predict_medical_plan(customer)["probabilities"]["High"] > 0.5


def test_gender_does_not_change_prediction():
    _, _, customer = KNOWN_CASES[0]
    a = predict_medical_plan({**customer, "gender": "Male"})
    b = predict_medical_plan({**customer, "gender": "Female"})
    assert a["probabilities"] == b["probabilities"]


def test_in_range_rows_have_no_warnings():
    for _, _, customer in KNOWN_CASES:
        assert predict_medical_plan(customer)["warnings"] == []


@pytest.mark.parametrize("field,value,keyword", [
    ("annual_expenditure_inr", 900000, "expenditure"),
    ("total_income_inr", 9000000, "income"),
    ("age", 90, "age"),
    ("family_members", 12, "family"),
])
def test_out_of_range_input_produces_warning(field, value, keyword):
    _, _, customer = KNOWN_CASES[0]
    result = predict_medical_plan({**customer, field: value})
    assert any(keyword in w.lower() for w in result["warnings"])


@pytest.mark.parametrize("income,bracket", [
    (151_934, "Tier-1"),
    (499_999, "Tier-1"),
    (500_000, "Tier-2"),
    (1_199_999, "Tier-2"),
    (1_200_000, "Tier-3"),
    (2_499_999, "Tier-3"),
    (2_500_000, "Tier-4"),
    (4_997_509, "Tier-4"),
])
def test_salary_bracket_derived_from_income(income, bracket):
    assert derive_salary_bracket(income)[0] == bracket


@pytest.mark.parametrize("name,expected,customer", KNOWN_CASES, ids=CASE_IDS)
def test_known_rows_bracket_matches_rule(name, expected, customer):
    assert derive_salary_bracket(customer["total_income_inr"])[0] == customer["salary_bracket"]


def test_supplied_bracket_is_ignored():
    _, _, customer = KNOWN_CASES[0]
    wrong = {**customer, "salary_bracket": "Tier-1"}
    assert predict_medical_plan(wrong) == predict_medical_plan(customer)
    assert predict_medical_plan(wrong)["derived"]["salary_bracket"] == customer["salary_bracket"]


def test_model_summary_reports_cv_scores():
    s = model_summary()
    assert 0 < s["cv_macro_f1"]["mean"] <= 1
    assert set(s["cv_recall_by_plan"]) == PLANS
    assert s["training_rows"] == 980
