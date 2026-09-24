# MedicalPlan-Xray

[![CI](https://github.com/Adityam-21/MedicalPlan-Xray/actions/workflows/ci.yml/badge.svg)](https://github.com/Adityam-21/MedicalPlan-Xray/actions/workflows/ci.yml)

An insurance plan-tier recommender that shows its reasoning: a scikit-learn decision tree
behind a FastAPI service and a React report UI, trained on 980 synthetic household profiles.

**Every number in this README comes from `python -m src.train evaluate` in this repository.**
Full results: [`reports/cv_results.md`](reports/cv_results.md) (rendered table) and
[`reports/cv_results.json`](reports/cv_results.json) (raw, with per-fold scores).
The [model card](docs/model_card.md) has the confusion matrix, per-tier scores and fairness notes.

| | |
|---|---|
| Model | Decision tree, depth 2 (depth chosen inside training folds) |
| Macro-F1 | **0.814 ± 0.021** (5-fold stratified CV) |
| Accuracy | **83.4%**, against a data ceiling of 95.7% |
| Recall by tier | High 87% · Medium 88% · **Low 63%** |
| Inputs | 7 (gender and row id deliberately excluded) |

---

## What this project was, and what changed

The first version of this project was a tuned XGBoost + SMOTE pipeline with a model card
claiming **87% F1** and a "Production-Ready" badge. An audit of the code found that the number
could not be reproduced, and that several things underneath it were wrong. Version 2 is the
result of fixing them.

### 1. The headline metric was measured against the data it was tuned on

The Optuna objective scored each trial with `f1_score(y_test_xgb, ...)`, so hyperparameters were
selected using the test set. A score chosen that way is optimistic by construction, and the
model card's 87% did not appear anywhere in the artifacts: `model_metrics.pkl` stored 0.796.

**Fix:** tuning now runs as **nested cross-validation** (`src/train.py`), so the search only ever
sees the training folds of the fold being scored. Re-scored honestly, the previously deployed
configuration gets **0.789 ± 0.033**.

### 2. The class mapping was fixed, but unverified

`class_mapping.pkl` mapped `{0: High, 1: Low, 2: Medium}`, which matches how `LabelEncoder`
orders labels alphabetically. Nothing in the test suite checked that, and the notebook smoke test
that appeared to confirm it was passing categories the encoder had never seen, so it would have
looked the same with a wrong mapping.

**Fix:** the label order is asserted against the encoder's own ordering, checked on known rows
through the API, and the model's class list is now read from its metadata file rather than a
separate pickle that could drift.

### 3. The tests only checked the shape of the response

They confirmed the JSON had the right keys and that probabilities summed to 1. A completely
scrambled label mapping would have passed.

**Fix:** 80+ tests, run on every push by GitHub Actions, covering predicted tiers on known rows, probability ordering, threshold
behaviour, input validation, deprecated-field handling, and every insight panel.

### 4. Complexity was not earning its place

Scored on identical folds, the entire candidate set looks like this:

| Model | Macro-F1 | Note |
|---|---|---|
| **Decision tree, depth tuned (shipped)** | **0.814 ± 0.021** | Depth 2, one feature |
| Decision tree, depth 3 | 0.815 ± 0.017 | Same score; depth chosen after seeing results |
| Decision tree, depth 2, **spending only** | 0.808 ± 0.031 | One input |
| XGBoost, tuned | 0.808 ± 0.028 | All features, nested tuning |
| XGBoost, tuned + SMOTE | 0.801 ± 0.037 | Oversampling did not help |
| XGBoost, defaults | 0.792 ± 0.033 | |
| Previously deployed config | 0.789 ± 0.033 | Re-scored without the leak |
| Logistic regression | 0.726 ± 0.026 | Linear baseline |
| Random forest, every input **except** spending | 0.719 ± 0.029 | What the other columns carry alone |
| Majority class | 0.199 ± 0.001 | Floor |

**Fix:** ship the tree. Every gap above is smaller than the fold-to-fold variation, so the boosted
model was not better — only harder to explain.

### 5. Features that added nothing

- **Gender** changed macro-F1 by 0.001 while the labels were gender-skewed (24.0% of men were
  labelled Low against 7.4% of women). Dropped.
- **`user_id`** correlated with the label. The preprocessing pipeline happened to discard it, but
  by accident rather than intent. Now excluded explicitly.
- **The four engineered features** changed macro-F1 by 0.001 (0.804 → 0.805 without them). Kept
  for display only.
- **Salary bracket** was derived from income for 979 of 980 rows, so the form stopped asking for
  it; the API computes it.

### 6. Claims the code did not support

"Production-Ready" and "Tests-Passing" badges with no CI, "AI Powered" labels in the UI, a fake
2.1-second "AI is analysing…" delay, and "explainable probability scores" for a model that
explained nothing. All removed. The UI now shows the actual decision path, flags close calls, and
publishes the model's weakest recall on the results page.

---

## Why the simple model won

Annual household spending alone reaches 0.808 macro-F1. Every other input combined, with spending
removed, reaches 0.719. Spending correlates with age (0.61), smoking (0.57) and family size (0.39),
so it already carries most of what the other columns say.

The shipped model is small enough to print in full:

```
if   spending <= ₹57,163      -> Low
elif spending <= ₹1,39,918    -> Medium
else                          -> High
```

That is not a limitation to hide; it is the finding. The API returns the threshold that decided
each prediction, the distance to the nearest tier change, and the count of training profiles
behind the answer — which a 267-tree ensemble scoring 0.006 lower could not do.

## Honest limits

- The data is **synthetic**; nothing here describes a real insurance market.
- **38 groups of identical profiles carry different labels**, capping accuracy at 95.7%.
- **Low tiers are caught only 63% of the time**, usually misread as Medium.
- Inputs outside the training ranges are scored but flagged in the response.
- A tier is not a product: premiums, exclusions and underwriting are outside this dataset.

---

## Architecture

```
frontend/   React 19 + Vite + Tailwind. Report UI, dark mode, no charting dependency.
backend/    FastAPI. app/features.py is the single source of truth for model inputs.
src/        train.py: nested-CV model comparison and the fit that produces the artifacts.
tests/      Value-level model tests, API tests, insight tests.
reports/    cv_results.json / .md — the numbers quoted above.
docs/       model_card.md — evaluation, confusion matrix, fairness, limitations
.github/    CI: backend tests and frontend build on every push
```

Training and inference import the **same** feature module, so the two cannot drift apart.

## Run it locally

Requires Python 3.12+ and Node 20+.

```bash
# Backend
python -m venv .venv
.venv\Scripts\Activate.ps1          # PowerShell; use source .venv/bin/activate on macOS/Linux
pip install -r requirements-dev.txt   # backend/requirements.txt alone = runtime only
cd backend
python -m uvicorn app.main:app --port 8000
```

```bash
# Frontend (second terminal)
cd frontend
npm install
npm run dev                          # http://localhost:5173
```

Copy `.env.example` to `.env` and fill in the Supabase values. Prediction logging fails softly, so
the API still works without them.

### Reproduce the numbers

```bash
python -m src.train evaluate           # compares every candidate, writes reports/
python -m src.train fit --model tree_tuned   # saves the model, metadata and reference stats
python -m pytest -q                    # 80+ tests
```

## API

`POST /predict`

```json
{
  "age": 45, "state_tier": "Tier-2", "occupation_class": "Medium-Risk",
  "total_income_inr": 700000, "annual_expenditure_inr": 135000,
  "is_smoker": 0, "family_members": 4
}
```

Returns the tier, probabilities, the decision path, close-call analysis, distance to the next
tier, percentiles, comparable-profile statistics, range warnings, model metadata and a
disclaimer. `gender` and `salary_bracket` are still accepted from v1 clients, ignored, and
reported back in `notices`.

`GET /model` returns the model summary and its cross-validated scores. `GET /health` is a probe.

## Data and privacy

Predictions are logged to Supabase (inputs, predicted tier, confidence). The form says so. There
is no authentication, so do not enter real personal data.

---

Built by [Kumar Adityam](https://www.linkedin.com/in/kumar-adityam/) ·
[GitHub](https://github.com/Adityam-21)

Educational demo. Not insurance, financial or medical advice.
