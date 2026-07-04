import math

from src.predict import predict_medical_plan


def test_prediction():

    customer = {
        "age": 35,
        "gender": "Male",
        "state_tier": "Tier-1",
        "occupation_class": "Low-Risk",
        "salary_bracket": "Tier-2",
        "total_income_inr": 600000,
        "annual_expenditure_inr": 250000,
        "is_smoker": 0,
        "family_members": 3,
    }

    result = predict_medical_plan(customer)

    assert "prediction" in result
    assert "probabilities" in result
    assert "warnings" in result

    probabilities = result["probabilities"]

    assert math.isclose(
        sum(probabilities.values()),
        1.0,
        abs_tol=0.02,
    )
