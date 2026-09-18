from typing import Literal, Optional

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    age: int = Field(..., ge=18, le=100)

    state_tier: Literal["Tier-1", "Tier-2", "Tier-3"]

    occupation_class: Literal["Low-Risk", "Medium-Risk", "High-Risk"]

    total_income_inr: float = Field(..., gt=0, description="Annual household income in INR")

    annual_expenditure_inr: float = Field(
        ..., ge=0, description="Total annual household spending in INR"
    )

    is_smoker: Literal[0, 1]

    family_members: int = Field(..., ge=1, le=20)

    # Deprecated in API v2. Still accepted (and validated) so v1 clients keep
    # working, but ignored: gender is not a model input, and the salary
    # bracket is derived from total_income_inr.
    gender: Optional[Literal["Male", "Female"]] = Field(
        default=None, deprecated=True, description="Deprecated and ignored."
    )
    salary_bracket: Optional[Literal["Tier-1", "Tier-2", "Tier-3", "Tier-4"]] = Field(
        default=None, deprecated=True, description="Deprecated and ignored."
    )
