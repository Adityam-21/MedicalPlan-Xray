"""
MedicalPlan-Xray training and evaluation.

Two commands, run from the repo root:

  python -m src.train evaluate            # compare models with 5-fold CV
  python -m src.train evaluate --quick    # fewer tuning iterations
  python -m src.train fit --model tree_d4 # train the chosen model on all data

`evaluate` writes reports/cv_results.json and reports/cv_results.md.
`fit` writes backend/models/plan_model.joblib, plan_model_meta.json and
reference_stats.json (aggregate context shown on the results page).
The live API keeps using insurance_model.pkl until it is switched over.

Honesty rules built in:
  - Every model is scored on the same 5 stratified folds.
  - Tuned models use nested CV: hyperparameters are searched on the
    training folds only, never on the fold being scored.
  - user_id and gender are excluded (see backend/app/features.py).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import platform
import sys
import time
import warnings
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import sklearn
from scipy.stats import randint, uniform
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import (
    GridSearchCV,
    RandomizedSearchCV,
    StratifiedKFold,
    cross_val_predict,
    cross_validate,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from app.features import (  # noqa: E402
    CATEGORICAL,
    CONTEXT_FACTORS,
    ENGINEERED,
    NUMERIC_BASE,
    PEER_LEVELS,
    TRAINING_RANGES,
    create_features,
    derive_salary_bracket,
)

DATA_PATH = ROOT / "data" / "processed" / "clean_data.csv"
REPORT_DIR = ROOT / "reports"
MODEL_DIR = ROOT / "backend" / "models"
SEED = 42
N_FOLDS = 5
SCORING = {"macro_f1": "f1_macro", "accuracy": "accuracy", "balanced_acc": "balanced_accuracy"}

warnings.filterwarnings("ignore", category=UserWarning)


# ----------------------------------------------------------------------------
# Data
# ----------------------------------------------------------------------------

def load_data():
    raw = DATA_PATH.read_bytes()
    df = pd.read_csv(DATA_PATH)
    # Use the same derived bracket the API uses (differs from the file on 1 row).
    df["salary_bracket"] = df["total_income_inr"].map(lambda x: derive_salary_bracket(x)[0])
    df = create_features(df)
    encoder = LabelEncoder()
    y = encoder.fit_transform(df["medical_plan"])
    info = {
        "path": str(DATA_PATH.relative_to(ROOT)).replace("\\", "/"),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "rows": int(len(df)),
        "class_counts": df["medical_plan"].value_counts().to_dict(),
    }
    return df, y, encoder, info


def label_noise_ceiling(df: pd.DataFrame) -> dict:
    """Best possible accuracy when identical inputs carry different labels."""
    cols = ["gender"] + NUMERIC_BASE + CATEGORICAL
    cols = [c for c in cols if c in df.columns]
    groups = df.groupby(cols)["medical_plan"]
    conflicting = int((groups.nunique() > 1).sum())
    best = int(groups.agg(lambda s: s.value_counts().iloc[0]).sum())
    return {
        "conflicting_groups": conflicting,
        "max_accuracy": round(best / len(df), 4),
        "note": "Computed on the original inputs including gender.",
    }


# ----------------------------------------------------------------------------
# Model registry
# ----------------------------------------------------------------------------

def columns(gender: bool, engineered: bool):
    nums = NUMERIC_BASE + (ENGINEERED if engineered else [])
    cats = CATEGORICAL + (["gender"] if gender else [])
    return nums, cats


def preprocessor(nums, cats, scale: bool):
    num_step = StandardScaler() if scale else "passthrough"
    return ColumnTransformer(
        [
            ("num", num_step, nums),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), cats),
        ],
        verbose_feature_names_out=False,
    )


def make_pipeline(model, nums, cats, scale=False, smote=False):
    pre = preprocessor(nums, cats, scale)
    if smote:
        from imblearn.over_sampling import SMOTE
        from imblearn.pipeline import Pipeline as ImbPipeline

        return ImbPipeline([("pre", pre), ("smote", SMOTE(random_state=SEED)), ("model", model)])
    return Pipeline([("pre", pre), ("model", model)])


def xgb(**params):
    from xgboost import XGBClassifier

    base = dict(
        objective="multi:softprob",
        eval_metric="mlogloss",
        random_state=SEED,
        n_jobs=1,
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
    )
    base.update(params)
    return XGBClassifier(**base)


def inner_cv():
    return StratifiedKFold(n_splits=3, shuffle=True, random_state=SEED)


XGB_SPACE = {
    "model__n_estimators": randint(50, 400),
    "model__max_depth": randint(2, 8),
    "model__learning_rate": uniform(0.01, 0.29),
    "model__subsample": uniform(0.6, 0.4),
    "model__colsample_bytree": uniform(0.6, 0.4),
    "model__min_child_weight": randint(1, 10),
    "model__gamma": uniform(0, 5),
}

# The configuration currently deployed as insurance_model.pkl.
LEGACY_XGB = dict(
    n_estimators=267, max_depth=10, learning_rate=0.11604368345086422,
    subsample=0.6209015706906675, colsample_bytree=0.6063302062680628,
    gamma=3.8237773703863125, min_child_weight=3,
)


def build(name: str, n_iter: int):
    """Return (estimator, description, needs_xgb_or_smote)."""
    tree = lambda d: DecisionTreeClassifier(max_depth=d, random_state=SEED)  # noqa: E731
    std = columns(gender=False, engineered=True)

    if name == "majority_baseline":
        return make_pipeline(DummyClassifier(strategy="most_frequent"), *std), "Always predicts the most common plan", False
    if name == "logreg_balanced":
        m = LogisticRegression(max_iter=2000, class_weight="balanced")
        return make_pipeline(m, *std, scale=True), "Logistic regression, balanced class weights", False
    if name.startswith("tree_d") and name[6:].isdigit():
        d = int(name[6:])
        return make_pipeline(tree(d), *std), f"Decision tree, max_depth={d}", False
    if name == "tree_d4_no_engineered":
        return make_pipeline(tree(4), *columns(False, False)), "Decision tree depth 4, without engineered features", False
    if name == "tree_d4_with_gender":
        return make_pipeline(tree(4), *columns(True, True)), "Decision tree depth 4, gender included", False
    if name == "tree_tuned":
        search = GridSearchCV(
            make_pipeline(DecisionTreeClassifier(random_state=SEED), *std),
            {"model__max_depth": list(range(2, 9)), "model__min_samples_leaf": [1, 5, 10]},
            scoring="f1_macro", cv=inner_cv(), n_jobs=-1,
        )
        return search, "Decision tree, depth and leaf size tuned on training folds", False
    if name == "xgb_default":
        return make_pipeline(xgb(), *std), "XGBoost defaults (depth 5, 100 trees)", True
    if name == "xgb_default_smote":
        return make_pipeline(xgb(), *std, smote=True), "XGBoost defaults + SMOTE", True
    if name == "xgb_default_with_gender":
        return make_pipeline(xgb(), *columns(True, True)), "XGBoost defaults, gender included", True
    if name == "xgb_tuned":
        search = RandomizedSearchCV(
            make_pipeline(xgb(), *std), XGB_SPACE, n_iter=n_iter,
            scoring="f1_macro", cv=inner_cv(), random_state=SEED, n_jobs=-1,
        )
        return search, f"XGBoost tuned on training folds ({n_iter} trials)", True
    if name == "xgb_tuned_smote":
        search = RandomizedSearchCV(
            make_pipeline(xgb(), *std, smote=True), XGB_SPACE, n_iter=n_iter,
            scoring="f1_macro", cv=inner_cv(), random_state=SEED, n_jobs=-1,
        )
        return search, f"XGBoost + SMOTE tuned on training folds ({n_iter} trials)", True
    if name == "tree_d2_spending_only":
        est = make_pipeline(tree(2), ["annual_expenditure_inr"], [])
        return est, "Decision tree depth 2, annual spending only", False
    if name == "rf_without_spending":
        from sklearn.ensemble import RandomForestClassifier

        nums = ["age", "total_income_inr", "family_members", "is_smoker", "income_per_member"]
        est = make_pipeline(
            RandomForestClassifier(n_estimators=300, random_state=SEED, n_jobs=-1), nums, CATEGORICAL
        )
        return est, "Random forest on every input EXCEPT spending-derived columns", False
    if name == "legacy_deployed":
        est = make_pipeline(xgb(**LEGACY_XGB), *columns(True, True), scale=True, smote=True)
        return est, "Currently deployed config (tuned on test set, SMOTE, gender) re-scored honestly", True
    raise ValueError(f"Unknown model: {name}")


CANDIDATES = [
    "majority_baseline",
    "logreg_balanced",
    "tree_d3", "tree_d4", "tree_d5", "tree_d6",
    "tree_d4_no_engineered",
    "tree_d4_with_gender",
    "tree_tuned",
    "tree_d2_spending_only",
    "rf_without_spending",
    "xgb_default",
    "xgb_default_smote",
    "xgb_default_with_gender",
    "xgb_tuned",
    "xgb_tuned_smote",
    "legacy_deployed",
]


def outer_cv():
    return StratifiedKFold(n_splits=N_FOLDS, shuffle=True, random_state=SEED)


# ----------------------------------------------------------------------------
# Commands
# ----------------------------------------------------------------------------

def evaluate(args):
    df, y, encoder, data_info = load_data()
    names = args.models or CANDIDATES
    results = []

    print(f"Data: {data_info['rows']} rows, classes {list(encoder.classes_)}")
    print(f"{N_FOLDS}-fold stratified CV, seed {SEED}\n")
    print(f"{'model':26} {'macro-F1':>16} {'accuracy':>16} {'bal.acc':>8} {'time':>6}")

    for name in names:
        try:
            est, desc, _ = build(name, args.n_iter)
        except ImportError as exc:
            print(f"{name:26} skipped ({exc.name} not installed)")
            continue
        start = time.time()
        cv = cross_validate(est, df, y, cv=outer_cv(), scoring=SCORING, n_jobs=1)
        secs = time.time() - start
        row = {"model": name, "description": desc, "seconds": round(secs, 1)}
        for key in SCORING:
            scores = cv[f"test_{key}"]
            row[key] = {
                "mean": round(float(scores.mean()), 4),
                "std": round(float(scores.std()), 4),
                "folds": [round(float(s), 4) for s in scores],
            }
        results.append(row)
        f1, acc = row["macro_f1"], row["accuracy"]
        print(f"{name:26} {f1['mean']:.3f} ± {f1['std']:.3f}    "
              f"{acc['mean']:.3f} ± {acc['std']:.3f}  {row['balanced_acc']['mean']:8.3f} {secs:5.0f}s")

    ceiling = label_noise_ceiling(df)
    print(f"\nLabel-noise ceiling: {ceiling['conflicting_groups']} conflicting groups, "
          f"max accuracy {ceiling['max_accuracy']:.3f}")

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "cv": {"folds": N_FOLDS, "stratified": True, "seed": SEED, "nested_tuning": True},
        "data": data_info,
        "label_noise_ceiling": ceiling,
        "versions": versions(),
        "results": sorted(results, key=lambda r: -r["macro_f1"]["mean"]),
    }
    REPORT_DIR.mkdir(exist_ok=True)
    (REPORT_DIR / "cv_results.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    (REPORT_DIR / "cv_results.md").write_text(markdown_table(report), encoding="utf-8")
    print(f"\nWrote {REPORT_DIR / 'cv_results.json'} and cv_results.md")


def fit(args):
    df, y, encoder, data_info = load_data()
    est, desc, _ = build(args.model, args.n_iter)

    print(f"Cross-validating {args.model} ...")
    cv = cross_validate(est, df, y, cv=outer_cv(), scoring=SCORING, n_jobs=1)
    oof = cross_val_predict(est, df, y, cv=outer_cv(), n_jobs=1)
    labels = list(encoder.classes_)

    print(f"Fitting {args.model} on all {len(df)} rows ...")
    est.fit(df, y)
    final = est.best_estimator_ if hasattr(est, "best_estimator_") else est
    best_params = getattr(est, "best_params_", None)

    pre = final.named_steps["pre"]
    model = final.named_steps["model"]
    feature_names = [str(f) for f in pre.get_feature_names_out()]
    importances = None
    if hasattr(model, "feature_importances_"):
        pairs = sorted(zip(feature_names, model.feature_importances_), key=lambda p: -p[1])
        importances = [{"feature": f, "importance": round(float(v), 4)} for f, v in pairs if v > 0]

    nums = list(pre.transformers_[0][2])
    cats = list(pre.transformers_[1][2])
    meta = {
        "model_version": args.version,
        "model_name": args.model,
        "description": desc,
        "model_class": type(model).__name__,
        "best_params": best_params,
        "trained_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "classes": labels,  # index i of predict_proba == classes[i]
        "input_features": {"numeric": nums, "categorical": cats},
        "encoded_feature_names": feature_names,
        "feature_importances": importances,
        "cv": {
            "folds": N_FOLDS,
            "seed": SEED,
            **{k: {"mean": round(float(cv[f"test_{k}"].mean()), 4),
                   "std": round(float(cv[f"test_{k}"].std()), 4)} for k in SCORING},
            "confusion_matrix": {
                "labels": labels,
                "rows_are_true": confusion_matrix(y, oof).tolist(),
            },
            "per_class": {
                k: {m: round(float(v), 4) for m, v in vals.items()}
                for k, vals in classification_report(
                    y, oof, target_names=labels, output_dict=True).items()
                if k in labels
            },
        },
        "label_noise_ceiling": label_noise_ceiling(df),
        "training_ranges": {k: [lo, hi] for k, (lo, hi, _) in TRAINING_RANGES.items()},
        "data": data_info,
        "versions": versions(),
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(final, MODEL_DIR / "plan_model.joblib")
    (MODEL_DIR / "plan_model_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    reference = build_reference_stats(df, labels)
    (MODEL_DIR / "reference_stats.json").write_text(json.dumps(reference, indent=2), encoding="utf-8")

    print(json.dumps({"model": args.model, "cv": {k: meta["cv"][k] for k in SCORING}}, indent=2))
    print("Confusion matrix (rows = true, cols = predicted):", labels)
    for label, row in zip(labels, meta["cv"]["confusion_matrix"]["rows_are_true"]):
        print(f"  {label:7} {row}")
    if best_params:
        print("Chosen by inner CV:", best_params)
    print(f"\nWrote {MODEL_DIR / 'plan_model.joblib'}, plan_model_meta.json, reference_stats.json")


# ----------------------------------------------------------------------------
# Reference statistics (aggregates only; no individual rows are stored)
# ----------------------------------------------------------------------------

def _group_stats(frame: pd.DataFrame, labels: list[str]) -> dict:
    mix = frame["medical_plan"].value_counts(normalize=True)
    return {
        "count": int(len(frame)),
        "median_expenditure": float(frame["annual_expenditure_inr"].median()),
        "plan_mix": {c: round(float(mix.get(c, 0.0)) * 100, 1) for c in labels},
    }


def build_reference_stats(df: pd.DataFrame, labels: list[str]) -> dict:
    ctx = pd.DataFrame({key: df[field].map(fn) for key, _, fn, field in CONTEXT_FACTORS})
    ctx["medical_plan"] = df["medical_plan"].values
    ctx["annual_expenditure_inr"] = df["annual_expenditure_inr"].values

    factors = {
        key: {str(g): _group_stats(part, labels) for g, part in ctx.groupby(key)}
        for key, *_ in CONTEXT_FACTORS
    }
    peers = {}
    for level in PEER_LEVELS:
        peers["|".join(level)] = {
            "|".join(map(str, g if isinstance(g, tuple) else (g,))): _group_stats(part, labels)
            for g, part in ctx.groupby(level)
        }
    qs = np.linspace(0, 1, 101)
    quantiles = {
        col: [round(float(v), 4) for v in df[col].quantile(qs)]
        for col in ("annual_expenditure_inr", "total_income_inr", "expense_ratio")
    }
    return {
        "rows": int(len(df)),
        "overall": _group_stats(ctx, labels),
        "quantiles": quantiles,
        "factors": factors,
        "peers": peers,
    }


# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------

def versions() -> dict:
    out = {"python": platform.python_version(), "scikit-learn": sklearn.__version__,
           "pandas": pd.__version__, "numpy": np.__version__}
    for pkg in ("xgboost", "imblearn"):
        try:
            out[pkg] = __import__(pkg).__version__
        except ImportError:
            pass
    return out


def markdown_table(report: dict) -> str:
    lines = [
        "# Cross-validation results",
        "",
        f"Generated {report['generated_at']} · {report['cv']['folds']}-fold stratified CV · "
        f"seed {report['cv']['seed']} · {report['data']['rows']} rows · "
        f"data sha256 `{report['data']['sha256'][:12]}`",
        "",
        "Tuned models use nested CV (search runs only on the training folds).",
        "",
        "| Model | Macro-F1 | Accuracy | Balanced acc. | Description |",
        "|---|---|---|---|---|",
    ]
    for r in report["results"]:
        f1, acc, bal = r["macro_f1"], r["accuracy"], r["balanced_acc"]
        lines.append(
            f"| `{r['model']}` | {f1['mean']:.3f} ± {f1['std']:.3f} | "
            f"{acc['mean']:.3f} ± {acc['std']:.3f} | {bal['mean']:.3f} | {r['description']} |"
        )
    c = report["label_noise_ceiling"]
    lines += [
        "",
        f"Label-noise ceiling: {c['conflicting_groups']} groups of identical inputs carry "
        f"different labels, so no model can exceed {c['max_accuracy']:.1%} accuracy on this data.",
        "",
    ]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p_eval = sub.add_parser("evaluate", help="compare candidate models with 5-fold CV")
    p_eval.add_argument("--models", nargs="*", choices=CANDIDATES, help="subset to run")
    p_eval.add_argument("--quick", action="store_true", help="8 tuning trials instead of 30")

    p_fit = sub.add_parser("fit", help="train one model on all data and save it")
    p_fit.add_argument("--model", required=True, choices=CANDIDATES)
    p_fit.add_argument("--quick", action="store_true")
    p_fit.add_argument("--version", default="2.0.0", help="model version recorded in metadata")

    args = parser.parse_args()
    args.n_iter = 8 if args.quick else 30
    {"evaluate": evaluate, "fit": fit}[args.command](args)


if __name__ == "__main__":
    main()
