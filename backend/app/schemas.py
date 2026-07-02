from pydantic import BaseModel, Field
from typing import Literal


class PredictionRequest(BaseModel):
    age: int = Field(..., ge=18, le=100)

    gender: Literal["Male", "Female"]

    state_tier: Literal[
        "Tier-1",
        "Tier-2",
        "Tier-3"
    ]

    occupation_class: Literal[
        "Low-Risk",
        "Medium-Risk",
        "High-Risk"
    ]

    salary_bracket: Literal[
        "Tier-1",
        "Tier-2",
        "Tier-3",
        "Tier-4"
    ]

    total_income_inr: float = Field(..., gt=0)

    annual_expenditure_inr: float = Field(..., ge=0)

    is_smoker: Literal[0, 1]

    family_members: int = Field(..., ge=1, le=20)