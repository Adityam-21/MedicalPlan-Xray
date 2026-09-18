"""
Single source of truth for model inputs.

Used by:
  - backend/app/predictor.py  (inference, ships in the Docker image)
  - src/train.py              (training and evaluation)
  - src/feature_engineering.py (re-export for notebooks)

Keep every feature definition here so training and inference cannot drift.
"""
import pandas as pd

# ----------------------------------------------------------------------------
# Column groups
# ----------------------------------------------------------------------------

NUMERIC_BASE = [
    "age",
    "total_income_inr",
    "annual_expenditure_inr",
    "family_members",
    "is_smoker",
]

ENGINEERED = [
    "expense_ratio",
    "savings",
    "income_per_member",
    "expenditure_per_member",
]

CATEGORICAL = [
    "state_tier",
    "occupation_class",
    "salary_bracket",
]

# Excluded on purpose (documented in the model card):
#   user_id -> an identifier; correlates with the label in this dataset, so it
#              would only let a model memorise row order.
#   gender  -> labels are gender-skewed in this synthetic data; see model card.
EXCLUDED = ["user_id", "gender"]

# ----------------------------------------------------------------------------
# Training ranges (min/max in data/processed/clean_data.csv, 980 rows)
# ----------------------------------------------------------------------------

TRAINING_RANGES = {
    "age": (18, 75, "Age"),
    "family_members": (1, 6, "Family size"),
    "total_income_inr": (151934, 4997509, "Income"),
    "annual_expenditure_inr": (5000, 416505, "Annual expenditure"),
}


def range_warnings(customer_data: dict) -> list[str]:
    warnings = []
    for field, (low, high, label) in TRAINING_RANGES.items():
        value = customer_data.get(field)
        if value is None:
            continue
        if value < low or value > high:
            warnings.append(
                f"{label} is outside training range ({low:,}–{high:,}); "
                "treat this prediction with extra caution."
            )
    return warnings


# ----------------------------------------------------------------------------
# Salary bracket (derived from income, not asked)
# ----------------------------------------------------------------------------
# These cut-offs reproduce the dataset's salary_bracket for 979 of 980 rows.

SALARY_BRACKETS = [
    # (upper bound exclusive, bracket, human label)
    (500_000, "Tier-1", "Tier-1 (below ₹5L a year)"),
    (1_200_000, "Tier-2", "Tier-2 (₹5L–₹12L a year)"),
    (2_500_000, "Tier-3", "Tier-3 (₹12L–₹25L a year)"),
    (float("inf"), "Tier-4", "Tier-4 (₹25L a year and above)"),
]


def derive_salary_bracket(total_income_inr: float) -> tuple[str, str]:
    for upper, bracket, label in SALARY_BRACKETS:
        if total_income_inr < upper:
            return bracket, label
    raise ValueError("unreachable")


# ----------------------------------------------------------------------------
# Display labels and context groups (used by insights and reference stats)
# ----------------------------------------------------------------------------

FEATURE_LABELS = {
    "age": "Age",
    "total_income_inr": "Annual income",
    "annual_expenditure_inr": "Annual household spending",
    "family_members": "Family size",
    "is_smoker": "Smoker",
    "expense_ratio": "Spending as a share of income",
    "savings": "Annual savings",
    "income_per_member": "Income per family member",
    "expenditure_per_member": "Spending per family member",
    "state_tier": "State tier",
    "occupation_class": "Occupation class",
    "salary_bracket": "Income bracket",
}

MONEY_FEATURES = {
    "total_income_inr", "annual_expenditure_inr", "savings",
    "income_per_member", "expenditure_per_member",
}

AGE_BANDS = [(18, 29, "18–29"), (30, 44, "30–44"), (45, 59, "45–59"), (60, 200, "60+")]
FAMILY_BANDS = [(1, 2, "1–2 people"), (3, 4, "3–4 people"), (5, 100, "5+ people")]


def _band(value, bands):
    for low, high, label in bands:
        if low <= value <= high:
            return label
    return bands[0][2] if value < bands[0][0] else bands[-1][2]


def age_band(age) -> str:
    return _band(age, AGE_BANDS)


def family_band(n) -> str:
    return _band(n, FAMILY_BANDS)


def smoker_label(is_smoker) -> str:
    return "Smoker" if int(is_smoker) == 1 else "Non-smoker"


# Context factors shown on the results page: (key, display name, grouping fn, input field)
CONTEXT_FACTORS = [
    ("age_band", "Age group", age_band, "age"),
    ("smoker", "Smoking", smoker_label, "is_smoker"),
    ("family_band", "Family size", family_band, "family_members"),
    ("state_tier", "State tier", str, "state_tier"),
    ("occupation_class", "Occupation class", str, "occupation_class"),
]

# Peer groups, most specific first; the first level with enough rows is used.
PEER_LEVELS = [
    ["age_band", "smoker", "family_band"],
    ["age_band", "smoker"],
    ["smoker"],
]
MIN_PEER_ROWS = 15


def context_keys(customer_data: dict) -> dict:
    return {key: fn(customer_data[field]) for key, _, fn, field in CONTEXT_FACTORS}


def format_inr(value: float) -> str:
    """Indian digit grouping, e.g. 1234567 -> ₹12,34,567."""
    negative = value < 0
    digits = str(int(round(abs(value))))
    if len(digits) > 3:
        head, tail = digits[:-3], digits[-3:]
        groups = []
        while len(head) > 2:
            groups.insert(0, head[-2:])
            head = head[:-2]
        if head:
            groups.insert(0, head)
        digits = ",".join(groups + [tail])
    return f"{'-' if negative else ''}₹{digits}"


def format_value(feature: str, value) -> str:
    if feature in MONEY_FEATURES:
        return format_inr(value)
    if feature == "expense_ratio":
        return f"{value:.0%}"
    if feature == "is_smoker":
        return smoker_label(value)
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


# ----------------------------------------------------------------------------
# Engineered features
# ----------------------------------------------------------------------------

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["expense_ratio"] = df["annual_expenditure_inr"] / df["total_income_inr"]
    df["savings"] = df["total_income_inr"] - df["annual_expenditure_inr"]
    df["income_per_member"] = df["total_income_inr"] / df["family_members"]
    df["expenditure_per_member"] = df["annual_expenditure_inr"] / df["family_members"]
    return df


def prepare_input(customer_data: dict) -> tuple[pd.DataFrame, dict]:
    """Turn one API request into a model-ready single-row DataFrame."""
    bracket, bracket_label = derive_salary_bracket(customer_data["total_income_inr"])
    row = {**customer_data, "salary_bracket": bracket}
    derived = {"salary_bracket": bracket, "salary_bracket_label": bracket_label}
    return create_features(pd.DataFrame([row])), derived
