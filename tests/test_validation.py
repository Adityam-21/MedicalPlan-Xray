import pytest

from pydantic import ValidationError

from backend.app.schemas import PredictionRequest


def test_invalid_family_members():

    with pytest.raises(ValidationError):

        PredictionRequest(
            age=30,
            gender="Male",
            state_tier="Tier-1",
            occupation_class="Low-Risk",
            salary_bracket="Tier-2",
            total_income_inr=500000,
            annual_expenditure_inr=150000,
            is_smoker=0,
            family_members=0,
        )
