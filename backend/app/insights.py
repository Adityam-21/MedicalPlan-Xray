"""
Result insights for one prediction.

Everything here is either read from the fitted decision tree or from
reference statistics computed on the training data at fit time
(backend/models/reference_stats.json). Nothing is invented at request time.

Language rules:
  - The tree section describes what the MODEL does.
  - The context section describes what the DATA shows. These are
    associations in a synthetic dataset, not causes and not advice.
"""
from __future__ import annotations

import math

import numpy as np

from app.features import (
    CONTEXT_FACTORS,
    FEATURE_LABELS,
    MIN_PEER_ROWS,
    NUMERIC_BASE,
    PEER_LEVELS,
    context_keys,
    format_inr,
    format_value,
    prepare_input,
)

# A result is a close call if either condition holds (documented in the model card).
CLOSE_MARGIN_PTS = 15.0      # top-two probabilities within 15 percentage points
CLOSE_BOUNDARY_REL = 0.10    # input within 10% of a threshold that changes the plan


# ----------------------------------------------------------------------------
# Tree helpers
# ----------------------------------------------------------------------------

def _tree_parts(pipeline):
    pre = pipeline.named_steps["pre"]
    model = pipeline.named_steps["model"]
    if not hasattr(model, "tree_"):
        return None
    names = [str(n) for n in pre.get_feature_names_out()]
    return pre, model, model.tree_, names


def _leaf_counts(tree, node, classes):
    fractions = tree.value[node][0]
    total = tree.weighted_n_node_samples[node]
    counts = np.rint(fractions / fractions.sum() * total).astype(int)
    return {c: int(n) for c, n in zip(classes, counts)}


def _condition_text(feature, threshold, went_left, value):
    label = FEATURE_LABELS.get(feature, feature)
    # One-hot columns look like "state_tier_Tier-3" with threshold 0.5.
    for base in ("state_tier", "occupation_class", "salary_bracket"):
        if feature.startswith(base + "_"):
            category = feature[len(base) + 1:]
            base_label = FEATURE_LABELS[base]
            verb = "is not" if went_left else "is"
            return f"{base_label} {verb} {category}"
    sign = "≤" if went_left else ">"
    return f"{label} {format_value(feature, value)} {sign} {format_value(feature, threshold)}"


def decision_path(pipeline, df, classes):
    parts = _tree_parts(pipeline)
    if parts is None:
        return None
    pre, model, tree, names = parts
    x = pre.transform(df)
    node_ids = model.decision_path(x).indices
    steps = []
    for node in node_ids:
        if tree.children_left[node] == tree.children_right[node]:
            continue
        feat = names[tree.feature[node]]
        threshold = float(tree.threshold[node])
        value = float(x[0, tree.feature[node]])
        went_left = value <= threshold
        steps.append({
            "feature": feat,
            "label": FEATURE_LABELS.get(feat, feat),
            "operator": "<=" if went_left else ">",
            "threshold": round(threshold, 2),
            "value": value,
            "text": _condition_text(feat, threshold, went_left, value),
        })
    leaf = int(node_ids[-1])
    counts = _leaf_counts(tree, leaf, classes)
    total = sum(counts.values())
    plan = max(counts, key=counts.get)
    evidence = {
        "counts": counts,
        "total": total,
        "share": round(counts[plan] / total * 100, 1) if total else None,
        "text": (
            f"{counts[plan]} of {total} training profiles that followed this same path "
            f"({counts[plan] / total:.0%}) had the {plan} plan."
        ) if total else None,
    }
    return steps, evidence


def _single_feature_bands(pipeline, classes):
    """If the tree splits on one numeric feature only, list its intervals."""
    parts = _tree_parts(pipeline)
    if parts is None:
        return None
    _, _, tree, names = parts
    used = {names[f] for f in tree.feature if f >= 0}
    if len(used) != 1:
        return None
    feature = used.pop()
    bands = []

    def walk(node, low, high):
        if tree.children_left[node] == tree.children_right[node]:
            counts = _leaf_counts(tree, node, classes)
            bands.append({"low": low, "high": high, "counts": counts,
                          "plan": max(counts, key=counts.get), "total": sum(counts.values())})
            return
        t = float(tree.threshold[node])
        walk(tree.children_left[node], low, t)
        walk(tree.children_right[node], t, high)

    walk(0, None, None)
    bands.sort(key=lambda b: -math.inf if b["low"] is None else b["low"])
    return feature, bands


def spending_bands(pipeline, classes, customer_data):
    found = _single_feature_bands(pipeline, classes)
    if found is None:
        return None
    feature, bands = found
    value = customer_data.get(feature)
    for b in bands:
        lo, hi = b["low"], b["high"]
        b["contains_user"] = value is not None and (lo is None or value > lo) and (hi is None or value <= hi)
        b["label"] = (
            f"up to {format_value(feature, hi)}" if lo is None
            else f"above {format_value(feature, lo)}" if hi is None
            else f"{format_value(feature, lo)} – {format_value(feature, hi)}"
        )
        b["share"] = {c: round(n / b["total"] * 100, 1) for c, n in b["counts"].items()} if b["total"] else {}
    return {"feature": feature, "label": FEATURE_LABELS.get(feature, feature), "bands": bands}


def boundaries(pipeline, classes, customer_data, current_plan):
    """Nearest thresholds (above and below) on raw inputs that would change the plan."""
    parts = _tree_parts(pipeline)
    if parts is None:
        return []
    _, _, tree, names = parts
    out = []
    for f_idx in sorted({f for f in tree.feature if f >= 0}):
        feature = names[f_idx]
        if feature not in NUMERIC_BASE or feature not in customer_data or feature == "is_smoker":
            continue
        value = float(customer_data[feature])
        thresholds = sorted({float(t) for f, t in zip(tree.feature, tree.threshold) if f == f_idx})

        def plan_at(v):
            df, _ = prepare_input({**customer_data, feature: v})
            return classes[int(pipeline.predict(df)[0])]

        above = [t for t in thresholds if t >= value]
        below = [t for t in thresholds if t < value]
        for direction, candidates in (("up", above), ("down", list(reversed(below)))):
            for t in candidates:
                crossed = math.floor(t) + 1 if direction == "up" else math.floor(t)
                new_plan = plan_at(crossed)
                if new_plan != current_plan:
                    distance = abs(crossed - value)
                    rel = distance / value if value else None
                    verb = "rose" if direction == "up" else "fell"
                    out.append({
                        "feature": feature,
                        "label": FEATURE_LABELS.get(feature, feature),
                        "direction": direction,
                        "value": value,
                        "threshold": round(t, 2),
                        "crossing_value": crossed,
                        "distance": round(distance, 2),
                        "relative_distance": round(rel, 4) if rel is not None else None,
                        "plan_if_crossed": new_plan,
                        "text": (
                            f"If {FEATURE_LABELS.get(feature, feature).lower()} {verb} by "
                            f"{format_value(feature, distance)} to {format_value(feature, crossed)}, "
                            f"the model would recommend {new_plan}."
                        ),
                    })
                    break
    return out


# ----------------------------------------------------------------------------
# Reference-data helpers
# ----------------------------------------------------------------------------

def percentile(value, quantiles):
    q = np.asarray(quantiles, dtype=float)
    if value <= q[0]:
        return 0.0
    if value >= q[-1]:
        return 100.0
    idx = np.searchsorted(q, value, side="right")
    return round(float(idx - 1) / (len(q) - 1) * 100, 1)


def percentiles(reference, customer_data, df):
    out = {}
    for key, value in (
        ("annual_expenditure_inr", customer_data["annual_expenditure_inr"]),
        ("total_income_inr", customer_data["total_income_inr"]),
        ("expense_ratio", float(df["expense_ratio"].iloc[0])),
    ):
        q = reference["quantiles"].get(key)
        if q is None:
            continue
        out[key] = {
            "label": FEATURE_LABELS[key],
            "value": value,
            "display": format_value(key, value),
            "percentile": percentile(value, q),
            "median": q[50],
            "median_display": format_value(key, q[50]),
        }
    return out


def peer_group(reference, keys, customer_data):
    for level in PEER_LEVELS:
        group_id = "|".join(keys[k] for k in level)
        stats = reference["peers"]["|".join(level)].get(group_id)
        if stats and stats["count"] >= MIN_PEER_ROWS:
            spend = customer_data["annual_expenditure_inr"]
            median = stats["median_expenditure"]
            diff = spend - median
            return {
                "definition": [keys[k] for k in level],
                "count": stats["count"],
                "median_expenditure": median,
                "median_display": format_inr(median),
                "plan_mix": stats["plan_mix"],
                "your_spending_vs_median": round(diff, 2),
                "text": (
                    f"Among {stats['count']} training profiles like yours "
                    f"({', '.join(keys[k] for k in level)}), median household spending is "
                    f"{format_inr(median)}; yours is {format_inr(abs(diff))} "
                    f"{'above' if diff >= 0 else 'below'} that."
                ),
            }
    return None


def factor_context(reference, keys):
    out = []
    for key, name, _, _ in CONTEXT_FACTORS:
        table = reference["factors"].get(key, {})
        stats = table.get(keys[key])
        if not stats:
            continue
        out.append({
            "factor": key,
            "label": name,
            "your_group": keys[key],
            "count": stats["count"],
            "median_expenditure": stats["median_expenditure"],
            "median_display": format_inr(stats["median_expenditure"]),
            "plan_mix": stats["plan_mix"],
            "all_groups": [
                {"group": g, **v} for g, v in table.items()
            ],
        })
    return out


# ----------------------------------------------------------------------------
# Public entry point
# ----------------------------------------------------------------------------

def build_insights(pipeline, meta, reference, customer_data, df, probabilities):
    classes = meta["classes"]
    ranked = sorted(probabilities.items(), key=lambda kv: -kv[1])
    (top, p1), (runner_up, p2) = ranked[0], ranked[1]
    margin = round((p1 - p2) * 100, 1)

    path = decision_path(pipeline, df, classes)
    steps, evidence = path if path else (None, None)
    bounds = boundaries(pipeline, classes, customer_data, top)

    reasons = []
    if margin < CLOSE_MARGIN_PTS:
        reasons.append(f"{top} and {runner_up} are only {margin} percentage points apart.")
    near = [b for b in bounds if b["relative_distance"] is not None
            and b["relative_distance"] < CLOSE_BOUNDARY_REL]
    for b in near:
        reasons.append(
            f"{b['label']} is within {b['relative_distance']:.0%} of the point where "
            f"the model switches to {b['plan_if_crossed']}."
        )

    used = [f["feature"] for f in (meta.get("feature_importances") or [])]
    if len(used) == 1:
        model_note = (
            f"This model's prediction depends only on "
            f"{FEATURE_LABELS.get(used[0], used[0]).lower()}. The other details you entered "
            "are shown below as context from the training data; they do not change the prediction."
        )
    else:
        model_note = None

    keys = context_keys(customer_data)
    return {
        "close_call": {
            "is_close_call": bool(reasons),
            "reasons": reasons,
            "runner_up": runner_up,
            "margin_pts": margin,
            "rule": (
                f"Close call if the top two plans are within {CLOSE_MARGIN_PTS:.0f} points, "
                f"or an input is within {CLOSE_BOUNDARY_REL:.0%} of a plan-changing threshold."
            ),
        },
        "model_note": model_note,
        "decision_path": steps,
        "evidence": evidence,
        "boundaries": bounds,
        "spending_bands": spending_bands(pipeline, classes, customer_data),
        "percentiles": percentiles(reference, customer_data, df),
        "peer_group": peer_group(reference, keys, customer_data),
        "factors": factor_context(reference, keys),
        "context_note": (
            "Context figures describe patterns in a synthetic training dataset of "
            f"{reference['rows']} profiles. They are associations, not causes."
        ),
    }
