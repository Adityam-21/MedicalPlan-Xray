# Model card — MedicalPlan-Xray plan-tier classifier v2.0.0

| | |
|---|---|
| Model | `DecisionTreeClassifier`, depth 2, `min_samples_leaf=1` |
| Selected by | Inner 3-fold grid search over depth 2–8 and leaf size, inside each outer fold |
| Artifacts | `backend/models/plan_model.joblib`, `plan_model_meta.json`, `reference_stats.json` |
| Training command | `python -m src.train fit --model tree_tuned` |
| Evaluation command | `python -m src.train evaluate` → `reports/cv_results.json` |
| Owner | [Kumar Adityam](https://github.com/Adityam-21) |
| Status | Educational demo. Not for insurance, financial or medical decisions. |

All figures below were produced by the commands above on the repository's data
(`data/processed/clean_data.csv`, SHA-256 `3dd9139939db…d6`). Nothing here is estimated or quoted
from elsewhere.

---

## Intended use

**For:** showing how an interpretable classifier can place a household profile into a Low, Medium
or High plan tier, and explaining that placement with the rule that produced it.

**Not for:** choosing, pricing or underwriting real insurance; screening real people; any decision
with consequences for the person described. The training data is synthetic.

## Inputs

| Input | Used by the model | Notes |
|---|---|---|
| `annual_expenditure_inr` | **Yes — the only feature the fitted tree splits on** | Total household spending |
| `age`, `family_members`, `is_smoker` | Passed in, not split on | Shown as data context |
| `state_tier`, `occupation_class` | Passed in, not split on | Shown as data context |
| `total_income_inr` | Passed in, not split on | Also used to derive `salary_bracket` |
| `salary_bracket` | Derived, not asked | Income cut-offs at ₹5L / ₹12L / ₹25L reproduce the dataset label for 979 of 980 rows |
| `gender` | **Excluded** | See *Fairness* |
| `user_id` | **Excluded** | Correlated with the label; an identifier, not a signal |

Four engineered features (spending ratio, savings, and per-member income and spending) are
computed and passed in; the tree does not split on them.

## The decision rule

The fitted model is small enough to print in full:

```
if   annual_expenditure_inr <= 57,163     -> Low     (111 training rows:   99 Low,  8 Medium,   4 High)
elif annual_expenditure_inr <= 1,39,918   -> Medium  (436 training rows:  351 Medium, 39 Low, 46 High)
elif annual_expenditure_inr <= 1,62,338   -> High    ( 67 training rows:   42 High, 22 Medium,  3 Low)
else                                      -> High    (366 training rows:  326 High, 26 Medium, 14 Low)
```

The reported "probabilities" are these leaf proportions. They describe the training rows in the
matching band, not the model's certainty about an individual, and the UI labels them that way.

## Evaluation

**Protocol:** 5-fold stratified cross-validation, seed 42. Tuned candidates use nested
cross-validation, so hyperparameter search never sees the fold being scored.

| Metric | Value |
|---|---|
| Macro-F1 | **0.814 ± 0.021** |
| Accuracy | **83.4% ± 1.4%** |
| Balanced accuracy | 79.1% |
| Accuracy ceiling of the data | **95.7%** |

### Per tier (out-of-fold predictions)

| Tier | Support | Recall | Precision |
|---|---|---|---|
| High | 418 | 86.8% | 85.2% |
| Medium | 407 | 87.7% | 79.3% |
| **Low** | 155 | **62.6%** | 93.3% |

### Confusion matrix (rows = true, columns = predicted)

| | High | Low | Medium |
|---|---|---|---|
| **High** | 363 | 3 | 52 |
| **Low** | 17 | 97 | 41 |
| **Medium** | 46 | 4 | 357 |

**Reading it:** the dominant error is Low households predicted as Medium (41 of 155). When the
model does say Low it is usually right (93% precision), but it misses more than a third of them.

### Why the ceiling is 95.7%

38 groups of rows have identical inputs but different labels. No model can separate them, so the
best achievable accuracy is 938 of 980. The model's 83.4% should be read against that ceiling,
not against 100%.

## Model selection

Every candidate was scored on the same folds:

| Candidate | Macro-F1 |
|---|---|
| Decision tree, depth tuned (**shipped**) | **0.814 ± 0.021** |
| Decision tree, depth 3 | 0.815 ± 0.017 |
| Decision tree, depth 2, **spending only** | 0.808 ± 0.031 |
| XGBoost, tuned | 0.808 ± 0.028 |
| XGBoost, tuned + SMOTE | 0.801 ± 0.037 |
| XGBoost, defaults | 0.792 ± 0.033 |
| Previously deployed config (v1.1.0), re-scored honestly | 0.789 ± 0.033 |
| Logistic regression, balanced | 0.726 ± 0.026 |
| Random forest, **every input except spending** | 0.719 ± 0.029 |
| Majority class | 0.199 ± 0.001 |

**Choice:** the tuned tree. No candidate beats it by more than the fold-to-fold standard
deviation, and it is the only one whose every prediction can be stated as a rule.

The depth-3 tree scores 0.001 higher, but its depth was picked after seeing the table, which makes
that number optimistic. The shipped tree's depth was chosen inside the training folds.

**Why one feature is enough:** in this dataset, spending already carries most of what the other
columns say. Removing it drops the best model from 0.814 to 0.719; using it alone gives 0.808.

## Fairness

`gender` was removed. Evidence from the training data:

- Adding it changed macro-F1 by **+0.001** (tree) and **+0.008** (XGBoost defaults), both inside
  the fold-to-fold standard deviation.
- Labels are gender-skewed: **24.0%** of male profiles are labelled Low against **7.4%** of female
  profiles (119 of 496 against 36 of 484).

A feature that adds no measurable accuracy while tracking a skew in the labels is a liability. The
v2 API still accepts `gender` from older clients, ignores it, and says so in the response.

No other protected attributes are present. The remaining inputs (age, smoking, family size) are
standard actuarial factors, but the model does not split on them either.

## Known limitations

- **Synthetic data.** Relationships in this dataset need not hold for real households.
- **Low tiers are under-detected**, at 62.6% recall.
- **Coarse outputs.** There are four leaves, so only four probability vectors are possible.
- **Out-of-range inputs** (age above 75, family size above 6, income or spending outside the
  training range) are scored but flagged with a warning in the response.
- **One feature decides.** A household whose spending is unusual for reasons the data does not
  capture will be misplaced, and the model cannot see why.

## Changes from v1

| | v1.1.0 | v2.0.0 |
|---|---|---|
| Model | XGBoost (267 trees, depth 10) + SMOTE | Decision tree, depth 2 |
| Reported score | "87% F1" (model card); 0.796 (stored metrics) | 0.814 ± 0.021, reproducible |
| Tuning | Scored against the test set | Nested cross-validation |
| Honest re-score of v1 | — | 0.789 ± 0.033 |
| Gender | Input | Excluded, with evidence |
| Label mapping | Hand-written pickle | Read from model metadata; asserted in tests |
| Tests | Response shape only | Predicted values, thresholds, insights |

## Data handling

Predictions are logged to a Supabase table (inputs, predicted tier, confidence). The form
discloses this. There is no authentication, so no real personal data should be entered.
