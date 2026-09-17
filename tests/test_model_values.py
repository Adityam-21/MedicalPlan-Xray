"""
Value-level tests for the inference path the API actually uses
(backend/app/predictor.py). These catch label-mapping regressions,
which shape-only tests cannot.
"""
import math

import pytest

from app.predictor import class_mapping, derive_salary_bracket, model, predict_medical_plan
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
    # Known rows carry their dataset bracket; the rule must agree with it.
    assert derive_salary_bracket(customer["total_income_inr"])[0] == customer["salary_bracket"]


def test_supplied_bracket_is_ignored():
    _, _, customer = KNOWN_CASES[0]
    wrong = {**customer, "salary_bracket": "Tier-1"}
    assert predict_medical_plan(wrong) == predict_medical_plan(customer)
    assert predict_medical_plan(wrong)["derived"]["salary_bracket"] == customer["salary_bracket"]
