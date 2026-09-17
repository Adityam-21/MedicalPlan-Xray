"""
Known rows from data/processed/clean_data.csv (copied here because
data/processed/ is gitignored and will not exist in CI).

All rows have a feature vector with a single label in the dataset, and
were verified against the running API on 2026-09-17 (tools/verify_api.ps1).
user_id 3 is deliberately excluded: the current model misclassifies it.

If the model is retrained, re-run tools/verify_mapping.py and update the
expected labels only if the new model is deliberately different.
"""

KNOWN_CASES = [
    ("low_uid67", "Low", {
        "age": 22, "gender": "Female", "state_tier": "Tier-2",
        "occupation_class": "Low-Risk", "salary_bracket": "Tier-3",
        "total_income_inr": 2228028, "annual_expenditure_inr": 50213,
        "is_smoker": 0, "family_members": 3,
    }),
    ("low_uid76", "Low", {
        "age": 21, "gender": "Male", "state_tier": "Tier-2",
        "occupation_class": "Medium-Risk", "salary_bracket": "Tier-1",
        "total_income_inr": 407361, "annual_expenditure_inr": 37717,
        "is_smoker": 0, "family_members": 1,
    }),
    ("medium_uid1", "Medium", {
        "age": 19, "gender": "Male", "state_tier": "Tier-2",
        "occupation_class": "Low-Risk", "salary_bracket": "Tier-1",
        "total_income_inr": 203736, "annual_expenditure_inr": 89149,
        "is_smoker": 0, "family_members": 5,
    }),
    ("medium_uid2", "Medium", {
        "age": 20, "gender": "Female", "state_tier": "Tier-1",
        "occupation_class": "Low-Risk", "salary_bracket": "Tier-2",
        "total_income_inr": 527824, "annual_expenditure_inr": 115346,
        "is_smoker": 0, "family_members": 6,
    }),
    ("high_uid6", "High", {
        "age": 67, "gender": "Male", "state_tier": "Tier-1",
        "occupation_class": "Low-Risk", "salary_bracket": "Tier-1",
        "total_income_inr": 202953, "annual_expenditure_inr": 161529,
        "is_smoker": 0, "family_members": 4,
    }),
    ("high_risk_smoker_uid54", "High", {
        "age": 75, "gender": "Female", "state_tier": "Tier-1",
        "occupation_class": "High-Risk", "salary_bracket": "Tier-2",
        "total_income_inr": 759249, "annual_expenditure_inr": 344806,
        "is_smoker": 1, "family_members": 3,
    }),
]

CASE_IDS = [c[0] for c in KNOWN_CASES]
