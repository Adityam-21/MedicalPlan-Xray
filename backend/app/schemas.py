from typing import Literal, Optional

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    age: int = Field(..., ge=18, le=100)

    gender: Literal["Male", "Female"]

    state_tier: Literal[
        "Tier-1",
        "Tier-2",
        "Tier-3",
    ]

    occupation_class: Literal[
        "Low-Risk",
        "Medium-Risk",
        "High-Risk",
    ]

    # Deprecated: the API derives the bracket from total_income_inr.
    # Still accepted (and validated) so older clients keep working, but ignored.
    salary_bracket: Optional[Literal[
        "Tier-1",
        "Tier-2",
        "Tier-3",
        "Tier-4",
    ]] = Field(
        default=None,
        deprecated=True,
        description="Deprecated and ignored; derived from total_income_inr.",
    )

    total_income_inr: float = Field(..., gt=0)

    annual_expenditure_inr: float = Field(..., ge=0)

    is_smoker: Literal[0, 1]

    family_members: int = Field(..., ge=1, le=20)
