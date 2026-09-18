"""
Tests for the result insights (backend/app/insights.py).
They check that insights are consistent with the model's own behaviour.
"""
import pytest

from app.features import prepare_input
from app.predictor import CLASSES, model, predict_medical_plan
from known_cases import CASE_IDS, KNOWN_CASES

BASE = {
    "age": 45, "state_tier": "Tier-2", "occupation_class": "Low-Risk",
    "total_income_inr": 900000, "annual_expenditure_inr": 135000,
    "is_smoker": 0, "family_members": 3,
}


def plan_for(customer):
    df, _ = prepare_input(customer)
    return CLASSES[int(model.predict(df)[0])]


@pytest.mark.parametrize("name,expected,customer", KNOWN_CASES, ids=CASE_IDS)
def test_insight_sections_present(name, expected, customer):
    ins = predict_medical_plan(customer)["insights"]
    for key in ("close_call", "decision_path", "evidence", "boundaries",
                "percentiles", "peer_group", "factors", "context_note"):
        assert key in ins
    assert ins["decision_path"], "a tree prediction must have at least one step"
    assert ins["evidence"]["total"] > 0
    assert len(ins["factors"]) == 5


@pytest.mark.parametrize("name,expected,customer", KNOWN_CASES, ids=CASE_IDS)
def test_evidence_majority_matches_prediction(name, expected, customer):
    result = predict_medical_plan(customer)
    counts = result["insights"]["evidence"]["counts"]
    assert max(counts, key=counts.get) == result["prediction"]


@pytest.mark.parametrize("name,expected,customer", KNOWN_CASES, ids=CASE_IDS)
def test_boundaries_really_change_the_plan(name, expected, customer):
    result = predict_medical_plan(customer)
    for b in result["insights"]["boundaries"]:
        moved = {**customer, b["feature"]: b["crossing_value"]}
        assert plan_for(moved) == b["plan_if_crossed"] != result["prediction"]


def test_exactly_one_band_contains_user():
    bands = predict_medical_plan(BASE)["insights"]["spending_bands"]
    if bands is None:
        pytest.skip("model is not a single-feature tree")
    assert sum(b["contains_user"] for b in bands["bands"]) == 1


def test_near_threshold_is_flagged_as_close_call():
    ins = predict_medical_plan(BASE)["insights"]
    nearest = min(b["relative_distance"] for b in ins["boundaries"])
    assert ins["close_call"]["is_close_call"] == (
        nearest < 0.10 or ins["close_call"]["margin_pts"] < 15
    )


def test_percentiles_are_ordered():
    low = predict_medical_plan({**BASE, "annual_expenditure_inr": 20000})
    high = predict_medical_plan({**BASE, "annual_expenditure_inr": 300000})
    p_low = low["insights"]["percentiles"]["annual_expenditure_inr"]["percentile"]
    p_high = high["insights"]["percentiles"]["annual_expenditure_inr"]["percentile"]
    assert 0 <= p_low < p_high <= 100


def test_peer_group_uses_enough_rows():
    peer = predict_medical_plan(BASE)["insights"]["peer_group"]
    assert peer["count"] >= 15
    assert abs(sum(peer["plan_mix"].values()) - 100) < 0.5


def test_context_does_not_change_prediction_for_spending_only_model():
    ins = predict_medical_plan(BASE)["insights"]
    if ins["model_note"] is None:
        pytest.skip("model uses more than one feature")
    smoker = predict_medical_plan({**BASE, "is_smoker": 1, "age": 70, "family_members": 6})
    assert smoker["probabilities"] == predict_medical_plan(BASE)["probabilities"]
