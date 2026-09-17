"""
Guards for the single-source feature module and the training script.
"""
import math

import pandas as pd
import pytest

import app.features as features
import app.predictor as predictor


def test_predictor_uses_shared_feature_module():
    assert predictor.create_features is features.create_features
    assert predictor.derive_salary_bracket is features.derive_salary_bracket


def test_src_reexports_point_to_shared_module():
    from src.feature_engineering import create_features

    assert create_features is features.create_features


def test_create_features_values():
    df = pd.DataFrame([{
        "total_income_inr": 1_000_000,
        "annual_expenditure_inr": 250_000,
        "family_members": 4,
    }])
    out = features.create_features(df).iloc[0]
    assert math.isclose(out["expense_ratio"], 0.25)
    assert out["savings"] == 750_000
    assert out["income_per_member"] == 250_000
    assert out["expenditure_per_member"] == 62_500


def test_create_features_does_not_mutate_input():
    df = pd.DataFrame([{"total_income_inr": 1.0, "annual_expenditure_inr": 1.0, "family_members": 1}])
    features.create_features(df)
    assert list(df.columns) == ["total_income_inr", "annual_expenditure_inr", "family_members"]


def test_prepare_input_adds_bracket_and_features():
    df, derived = features.prepare_input({
        "age": 30, "gender": "Male", "state_tier": "Tier-1",
        "occupation_class": "Low-Risk", "total_income_inr": 800_000,
        "annual_expenditure_inr": 200_000, "is_smoker": 0, "family_members": 2,
    })
    assert derived["salary_bracket"] == "Tier-2"
    needed = features.NUMERIC_BASE + features.ENGINEERED + features.CATEGORICAL
    assert set(needed) <= set(df.columns)


def test_excluded_columns_are_not_model_inputs():
    inputs = set(features.NUMERIC_BASE + features.ENGINEERED + features.CATEGORICAL)
    assert not inputs & set(features.EXCLUDED)


@pytest.mark.parametrize("name", [
    "majority_baseline", "logreg_balanced", "tree_d3", "tree_d4",
    "tree_d4_no_engineered", "tree_d4_with_gender", "tree_tuned",
])
def test_training_candidates_build(name):
    from src.train import build

    estimator, description, _ = build(name, n_iter=2)
    assert hasattr(estimator, "fit") and description
