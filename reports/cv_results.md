# Cross-validation results

Generated 2026-09-24T10:58:48+00:00 · 5-fold stratified CV · seed 42 · 980 rows · data sha256 `3dd9139939db`

Tuned models use nested CV (search runs only on the training folds).

| Model | Macro-F1 | Accuracy | Balanced acc. | Description |
|---|---|---|---|---|
| `tree_d3` | 0.815 ± 0.017 | 0.836 ± 0.016 | 0.792 | Decision tree, max_depth=3 |
| `tree_tuned` | 0.814 ± 0.021 | 0.834 ± 0.014 | 0.790 | Decision tree, depth and leaf size tuned on training folds |
| `xgb_tuned` | 0.808 ± 0.028 | 0.830 ± 0.022 | 0.792 | XGBoost tuned on training folds (30 trials) |
| `tree_d2_spending_only` | 0.808 ± 0.031 | 0.828 ± 0.025 | 0.788 | Decision tree depth 2, annual spending only |
| `tree_d4_no_engineered` | 0.805 ± 0.024 | 0.827 ± 0.018 | 0.786 | Decision tree depth 4, without engineered features |
| `tree_d4_with_gender` | 0.805 ± 0.029 | 0.825 ± 0.023 | 0.790 | Decision tree depth 4, gender included |
| `tree_d4` | 0.804 ± 0.029 | 0.824 ± 0.023 | 0.789 | Decision tree, max_depth=4 |
| `xgb_tuned_smote` | 0.801 ± 0.037 | 0.820 ± 0.032 | 0.802 | XGBoost + SMOTE tuned on training folds (30 trials) |
| `tree_d5` | 0.801 ± 0.025 | 0.821 ± 0.023 | 0.787 | Decision tree, max_depth=5 |
| `xgb_default_with_gender` | 0.800 ± 0.025 | 0.817 ± 0.019 | 0.788 | XGBoost defaults, gender included |
| `xgb_default_smote` | 0.793 ± 0.032 | 0.811 ± 0.030 | 0.790 | XGBoost defaults + SMOTE |
| `xgb_default` | 0.792 ± 0.033 | 0.812 ± 0.027 | 0.780 | XGBoost defaults (depth 5, 100 trees) |
| `legacy_deployed` | 0.789 ± 0.033 | 0.810 ± 0.028 | 0.796 | Currently deployed config (tuned on test set, SMOTE, gender) re-scored honestly |
| `tree_d6` | 0.777 ± 0.034 | 0.802 ± 0.034 | 0.772 | Decision tree, max_depth=6 |
| `logreg_balanced` | 0.726 ± 0.026 | 0.751 ± 0.028 | 0.755 | Logistic regression, balanced class weights |
| `rf_without_spending` | 0.719 ± 0.029 | 0.751 ± 0.016 | 0.706 | Random forest on every input EXCEPT spending-derived columns |
| `majority_baseline` | 0.199 ± 0.001 | 0.426 ± 0.003 | 0.333 | Always predicts the most common plan |

Label-noise ceiling: 38 groups of identical inputs carry different labels, so no model can exceed 95.7% accuracy on this data.
