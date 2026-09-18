import { formatINR, ordinal } from "./format";

/**
 * General descriptions of what the three tiers usually mean in insurance.
 * The dataset stores only the tier label — no premiums, no benefits — so
 * these are plain-language definitions, not figures from the model.
 */
export const PLAN_GUIDE = {
    Low: {
        headline: "Entry-level cover",
        what:
            "The smallest sum insured and the lowest premium, with more of any bill left to the household. " +
            "Usually chosen when medical spending is modest and predictable.",
        watch: "Check the cover limit against a single hospital stay, not against a normal year.",
    },
    Medium: {
        headline: "Mid-range cover",
        what:
            "A middle sum insured at a moderate premium. The common choice when household medical spending is " +
            "steady but not unusually high.",
        watch: "Check whether the limit stretches across everyone in the household, not just one person.",
    },
    High: {
        headline: "Higher cover",
        what:
            "The largest sum insured at the highest premium. Typically chosen where spending is already high, " +
            "or where an older member, a larger family or a risk factor makes big bills more likely.",
        watch: "Check what the extra premium buys — room limits, co-pay and exclusions matter more than headline cover.",
    },
};

/** Questions worth asking before acting. Deliberately not recommendations. */
export const NEXT_QUESTIONS = [
    "How does the annual premium compare with what the household already spends?",
    "What is excluded, and what are the waiting periods?",
    "Does the sum insured cover everyone, or is it shared across the family?",
    "Would a licensed adviser reach the same tier from the full picture?",
];

/**
 * Data-grounded reasons this tier fits, built only from the API's insights.
 * Every line is traceable to the model or the training data.
 */
export function buildFitReasons({ insights, inputs, plan, metadata }) {
    const reasons = [];
    const spend = insights.percentiles?.annual_expenditure_inr;

    if (spend) {
        reasons.push({
            label: "Where the spending sits",
            text: `Annual household spending of ${spend.display} is at the ${ordinal(
                spend.percentile
            )} percentile of the training data, against a median of ${spend.median_display}.`,
        });
    }

    if (insights.evidence?.counts) {
        const counts = insights.evidence.counts;
        const total = insights.evidence.total;
        reasons.push({
            label: "What similar spending led to",
            text: `Of ${total} training profiles in the same spending band, ${counts[plan]} were ${plan} tier (${insights.evidence.share}%).`,
        });
    }

    const peer = insights.peer_group;
    if (peer) {
        const share = peer.plan_mix[plan] ?? 0;
        const topPeer = Object.entries(peer.plan_mix).sort((a, b) => b[1] - a[1])[0];
        reasons.push({
            label: "Profiles with similar circumstances",
            text:
                share >= 50
                    ? `Among ${peer.count} profiles matching this age group, smoking status and family size, ${share}% are also ${plan} tier.`
                    : `Among ${peer.count} profiles matching this age group, smoking status and family size, only ${share}% are ${plan} tier — most are ${topPeer[0]}. The tier here comes from this household's spending, which sits ${
                          peer.your_spending_vs_median >= 0 ? "above" : "below"
                      } their median of ${peer.median_display}.`,
        });
    }

    const upward = insights.boundaries?.find((b) => b.direction === "down");
    if (upward) {
        reasons.push({
            label: "How settled the tier is",
            text: `Spending would have to fall by ${formatINR(upward.distance)} before the model moved to ${upward.plan_if_crossed}.`,
        });
    }

    return reasons;
}

/** Honest cautions attached to this particular result. */
export function buildCautions({ insights, plan, metadata, warnings }) {
    const cautions = [];

    if (insights.close_call?.is_close_call) {
        cautions.push(
            `This was a close call against ${insights.close_call.runner_up}. Treat the two tiers as roughly equally plausible.`
        );
    }

    const recall = metadata.cv_recall_by_plan?.[plan];
    if (recall !== undefined && recall < 0.75) {
        cautions.push(
            `The model catches only ${(recall * 100).toFixed(0)}% of true ${plan}-tier profiles, so a missed ${plan} is the most likely kind of error here.`
        );
    }

    if (warnings?.length) {
        cautions.push("One or more inputs fall outside the range the model was trained on.");
    }

    cautions.push(
        "The training data is synthetic, so these patterns describe the dataset rather than any real insurance market."
    );

    return cautions;
}
