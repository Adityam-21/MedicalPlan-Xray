import { formatINR, pct, shortINR } from "../../utils/format";

/**
 * Sequential scale, not a traffic light: the plans are tiers of cover, and a
 * High tier is a recommendation rather than a danger signal. Intensity rises
 * with the tier so the bars stay readable in greyscale and when printed.
 */
export const PLAN_BG = {
    Low: "bg-sky-300",
    Medium: "bg-indigo-400",
    High: "bg-indigo-700",
};
export const PLAN_DOT = {
    Low: "bg-sky-300",
    Medium: "bg-indigo-400",
    High: "bg-indigo-700",
};
const PLAN_ORDER = ["Low", "Medium", "High"];

export function ProbabilityBars({ probabilities, recommended }) {
    return (
        <div className="space-y-3.5">
            {PLAN_ORDER.map((plan) => (
                <div key={plan}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                        <span
                            className={
                                plan === recommended
                                    ? "text-sm font-semibold text-slate-900"
                                    : "text-sm text-slate-500"
                            }
                        >
                            {plan}
                        </span>
                        <span
                            className={`tabular-nums text-sm ${
                                plan === recommended ? "font-semibold text-slate-900" : "text-slate-500"
                            }`}
                        >
                            {pct(probabilities[plan], 1)}
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-sm bg-slate-100">
                        <div
                            className={`h-full ${PLAN_BG[plan]} ${plan === recommended ? "" : "opacity-45"}`}
                            style={{ width: `${Math.max(probabilities[plan], 1)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function PlanMixBar({ mix, height = "h-2.5" }) {
    return (
        <div className={`flex ${height} w-full overflow-hidden rounded-sm bg-slate-100`}>
            {PLAN_ORDER.map((plan) =>
                mix[plan] > 0 ? (
                    <div
                        key={plan}
                        className={PLAN_BG[plan]}
                        style={{ width: `${mix[plan]}%` }}
                        title={`${plan}: ${pct(mix[plan], 0)}`}
                    />
                ) : null
            )}
        </div>
    );
}

export function PlanMixLegend({ className = "" }) {
    return (
        <div className={`flex flex-wrap gap-4 text-[11px] text-slate-500 ${className}`}>
            {PLAN_ORDER.map((plan) => (
                <span key={plan} className="flex items-center gap-1.5">
                    <span className={`inline-block h-2 w-2 rounded-sm ${PLAN_DOT[plan]}`} />
                    {plan}
                </span>
            ))}
        </div>
    );
}

/** The model's spending bands drawn to scale, with a marker for this profile. */
export function BandStrip({ bands, value, label }) {
    const edges = bands.map((b) => b.high).filter((h) => h !== null);
    const maxEdge = Math.max(...edges, value) * 1.12;
    const widthOf = (b) => (((b.high ?? maxEdge) - (b.low ?? 0)) / maxEdge) * 100;
    const markerLeft = Math.min((value / maxEdge) * 100, 99);

    return (
        <figure>
            <div className="relative pt-8">
                <div
                    className="absolute top-0 z-20 -translate-x-1/2 whitespace-nowrap rounded-sm bg-slate-900 px-2 py-1 text-[11px] font-medium tabular-nums text-white"
                    style={{ left: `${markerLeft}%` }}
                >
                    {formatINR(value)}
                </div>
                <div
                    className="absolute top-7 z-20 h-10 w-px -translate-x-1/2 bg-slate-900"
                    style={{ left: `${markerLeft}%` }}
                />
                <div className="flex h-10 w-full overflow-hidden rounded-sm">
                    {bands.map((b, i) => (
                        <div
                            key={i}
                            className={`${PLAN_BG[b.plan]} ${
                                b.contains_user ? "" : "opacity-35"
                            } flex items-center justify-center border-r border-white/70 last:border-0`}
                            style={{ width: `${widthOf(b)}%` }}
                            title={`${b.label}: ${b.plan}`}
                        >
                            <span className="truncate px-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                                {b.plan}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="relative mt-1.5 h-4">
                    {bands.slice(0, -1).map((b, i) => (
                        <span
                            key={i}
                            className="absolute -translate-x-1/2 text-[10px] tabular-nums text-slate-400"
                            style={{ left: `${((b.high ?? 0) / maxEdge) * 100}%` }}
                        >
                            {shortINR(b.high)}
                        </span>
                    ))}
                </div>
            </div>
            <figcaption className="mt-2 text-[11px] text-slate-500">
                {label} — the thresholds this model splits on
            </figcaption>
        </figure>
    );
}

/** Where this profile sits in the training distribution. */
export function PercentileRow({ item }) {
    return (
        <div>
            <div className="flex items-baseline justify-between">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className="text-sm font-semibold tabular-nums text-slate-900">{item.display}</span>
            </div>
            <div className="relative mt-2 h-1.5 rounded-sm bg-slate-100">
                <div
                    className="absolute inset-y-0 left-0 rounded-sm bg-indigo-200"
                    style={{ width: `${item.percentile}%` }}
                />
                <div
                    className="absolute top-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-slate-900"
                    style={{ left: `${item.percentile}%` }}
                />
            </div>
            <p className="mt-1.5 text-[11px] tabular-nums text-slate-500">
                {Math.round(item.percentile)}th percentile · dataset median {item.median_display}
            </p>
        </div>
    );
}
