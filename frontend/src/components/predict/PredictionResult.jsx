import {
    BandStrip,
    PercentileRow,
    PlanMixBar,
    PlanMixLegend,
    ProbabilityBars,
} from "./charts";
import { pct } from "../../utils/format";
import { NEXT_QUESTIONS, PLAN_GUIDE, buildCautions, buildFitReasons } from "../../utils/planGuide";

/** Report panel: hairline border, small-caps header, quiet body. */
function Panel({ title, note, className = "", children, footer }) {
    return (
        <section className={`flex flex-col rounded-xl border border-slate-200 bg-white ${className}`}>
            <header className="flex items-baseline justify-between gap-3 border-b border-slate-100 px-5 py-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">{title}</h3>
                {note && <span className="text-[11px] tabular-nums text-slate-400">{note}</span>}
            </header>
            <div className="flex-1 px-5 py-4">{children}</div>
            {footer && (
                <footer className="border-t border-slate-100 px-5 py-3 text-[11px] leading-relaxed text-slate-500">
                    {footer}
                </footer>
            )}
        </section>
    );
}

function Placeholder({ children }) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
            {children}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12" aria-live="polite" aria-busy="true">
            <div className="h-48 animate-pulse rounded-xl bg-slate-100 lg:col-span-5" />
            <div className="h-48 animate-pulse rounded-xl bg-slate-100 lg:col-span-7" />
            <div className="h-40 animate-pulse rounded-xl bg-slate-100 lg:col-span-4" />
            <div className="h-40 animate-pulse rounded-xl bg-slate-100 lg:col-span-4" />
            <div className="h-40 animate-pulse rounded-xl bg-slate-100 lg:col-span-4" />
        </div>
    );
}

function ErrorState({ message, onRetry }) {
    return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-5">
            <p className="text-sm font-semibold text-amber-900">Could not get a prediction</p>
            <p className="mt-1 text-sm text-amber-800">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-3 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                    Try again
                </button>
            )}
        </div>
    );
}

function Stat({ label, value, hint }) {
    return (
        <div className="border-b border-slate-100 py-2 last:border-0">
            <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-slate-600">{label}</span>
                <span className="text-sm font-semibold tabular-nums text-slate-900">{value}</span>
            </div>
            {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
        </div>
    );
}

function PredictionResult({ prediction, isLoading, error, onRetry }) {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} onRetry={onRetry} />;
    if (!prediction) {
        return (
            <Placeholder>
                <p className="text-sm font-medium text-slate-700">No profile scored yet</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                    Fill in the details, or pick an example. You will get the recommended tier, the spending
                    thresholds behind it, and how the profile compares with the 980 training profiles.
                </p>
            </Placeholder>
        );
    }

    const { prediction: result, insights, inputs, warnings, notices, metadata, disclaimer } = prediction;
    const plan = result.recommended_plan;
    const close = insights.close_call;
    const fitReasons = buildFitReasons({ insights, inputs, plan, metadata });
    const cautions = buildCautions({ insights, plan, metadata, warnings });
    const generated = new Date().toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

    return (
        <div className="space-y-5">
            {/* Report header */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.09em] text-slate-700">
                    Plan recommendation report
                </h2>
                <p className="text-[11px] tabular-nums text-slate-500">
                    {metadata.model_type} · model v{metadata.model_version} · API v{metadata.api_version} ·{" "}
                    {generated}
                </p>
            </div>

            {(warnings?.length > 0 || notices?.length > 0) && (
                <div className="space-y-2">
                    {warnings.map((w, i) => (
                        <p
                            key={`w${i}`}
                            className="rounded-lg border-l-2 border-amber-400 bg-amber-50 px-4 py-2.5 text-sm text-amber-900"
                        >
                            {w}
                        </p>
                    ))}
                    {notices.map((n, i) => (
                        <p key={`n${i}`} className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm text-slate-600">
                            {n}
                        </p>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                {/* Recommendation */}
                <Panel
                    title="Recommendation"
                    className="lg:col-span-5"
                    footer={disclaimer}
                >
                    <p className="text-[11px] uppercase tracking-[0.09em] text-slate-500">Plan tier</p>
                    <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900">{plan}</p>

                    {close.is_close_call ? (
                        <div className="mt-4 rounded-lg border-l-2 border-amber-400 bg-amber-50 px-4 py-3">
                            <p className="text-sm font-semibold text-amber-900">
                                Close call — {plan} and {close.runner_up} are hard to separate
                            </p>
                            <ul className="mt-1.5 space-y-1 text-sm text-amber-800">
                                {close.reasons.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-slate-600">
                            Clear margin: the next plan, {close.runner_up}, is{" "}
                            <span className="font-semibold tabular-nums text-slate-900">{close.margin_pts}</span>{" "}
                            points behind.
                        </p>
                    )}

                    {insights.evidence?.text && (
                        <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-700">
                            {insights.evidence.text}
                        </p>
                    )}
                </Panel>

                {/* Why this plan */}
                <Panel
                    title="Why this plan"
                    note={insights.spending_bands ? "single-feature rule" : undefined}
                    className="lg:col-span-7"
                    footer={insights.model_note ?? undefined}
                >
                    {insights.spending_bands && (
                        <BandStrip
                            bands={insights.spending_bands.bands}
                            value={inputs.annual_expenditure_inr}
                            label={insights.spending_bands.label}
                        />
                    )}
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ol className="space-y-2">
                            {insights.decision_path.map((step, i) => (
                                <li key={i} className="flex gap-2.5 text-sm leading-snug text-slate-700">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-slate-900 text-[10px] font-semibold text-white">
                                        {i + 1}
                                    </span>
                                    {step.text}
                                </li>
                            ))}
                        </ol>
                        {insights.boundaries.length > 0 && (
                            <div className="rounded-lg bg-slate-50 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">
                                    Distance to a different tier
                                </p>
                                <ul className="mt-2 space-y-1.5 text-sm leading-snug text-slate-700">
                                    {insights.boundaries.map((b, i) => (
                                        <li key={i}>{b.text}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Panel>

                {/* What this means for the household */}
                <Panel
                    title="What this tier means for this household"
                    className="lg:col-span-12"
                    footer="Tier descriptions are general insurance definitions. The dataset records only the tier label — no premiums, sums insured or benefits — so nothing here is a product recommendation."
                >
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-4">
                            <p className="text-base font-semibold text-slate-900">
                                {plan} tier — {PLAN_GUIDE[plan].headline}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{PLAN_GUIDE[plan].what}</p>
                            <p className="mt-3 rounded-lg bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
                                {PLAN_GUIDE[plan].watch}
                            </p>
                        </div>

                        <div className="lg:col-span-5">
                            <p className="eyebrow">Why it fits this profile</p>
                            <ul className="mt-3 space-y-3">
                                {fitReasons.map((reason) => (
                                    <li key={reason.label}>
                                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                            {reason.label}
                                        </p>
                                        <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{reason.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-3">
                            <p className="eyebrow">Read with care</p>
                            <ul className="mt-3 space-y-2">
                                {cautions.map((caution, i) => (
                                    <li key={i} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                        {caution}
                                    </li>
                                ))}
                            </ul>
                            <p className="eyebrow mt-5">Questions to ask next</p>
                            <ul className="mt-3 space-y-2">
                                {NEXT_QUESTIONS.map((q) => (
                                    <li key={q} className="flex gap-2.5 text-sm leading-snug text-slate-600">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                                        {q}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Panel>

                {/* Probabilities */}
                <Panel
                    title="Plan likelihood"
                    className="lg:col-span-4"
                    footer="Proportions of training profiles in the matching group, not a measure of certainty about this person."
                >
                    <ProbabilityBars probabilities={result.probabilities} recommended={plan} />
                </Panel>

                {/* Percentiles */}
                <Panel
                    title="This profile vs the dataset"
                    note={`n = ${metadata.training_rows}`}
                    className="lg:col-span-4"
                >
                    <div className="space-y-4">
                        {Object.entries(insights.percentiles).map(([key, item]) => (
                            <PercentileRow key={key} item={item} />
                        ))}
                    </div>
                </Panel>

                {/* Peers */}
                {insights.peer_group && (
                    <Panel
                        title="Comparable profiles"
                        note={`n = ${insights.peer_group.count}`}
                        className="lg:col-span-4"
                    >
                        <p className="text-sm leading-relaxed text-slate-700">{insights.peer_group.text}</p>
                        <div className="mt-4">
                            <PlanMixBar mix={insights.peer_group.plan_mix} height="h-3" />
                            <p className="mt-2 text-[11px] tabular-nums text-slate-500">
                                {Object.entries(insights.peer_group.plan_mix)
                                    .map(([p, v]) => `${p} ${pct(v, 0)}`)
                                    .join("  ·  ")}
                            </p>
                        </div>
                    </Panel>
                )}

                {/* Factor context */}
                <Panel
                    title="Dataset patterns by detail"
                    className="lg:col-span-7"
                    footer="Associations in the training data, not causes. None of these change the prediction above."
                >
                    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                        {insights.factors.map((f) => (
                            <div key={f.factor}>
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-sm text-slate-600">
                                        {f.label}:{" "}
                                        <span className="font-semibold text-slate-900">{f.your_group}</span>
                                    </span>
                                    <span className="text-[11px] tabular-nums text-slate-400">n = {f.count}</span>
                                </div>
                                <div className="mt-1.5">
                                    <PlanMixBar mix={f.plan_mix} />
                                </div>
                                <p className="mt-1 text-[11px] tabular-nums text-slate-500">
                                    median spend {f.median_display}
                                </p>
                            </div>
                        ))}
                    </div>
                    <PlanMixLegend className="mt-5 border-t border-slate-100 pt-4" />
                </Panel>

                {/* Model performance */}
                <Panel
                    title="Model performance"
                    note={`${metadata.cv_folds}-fold CV`}
                    className="lg:col-span-5"
                    footer={`Low tiers are hardest for this model: about ${(
                        metadata.cv_recall_by_plan.Low * 100
                    ).toFixed(0)}% are caught, and Medium is often predicted instead.`}
                >
                    <Stat
                        label="Macro-F1"
                        value={`${metadata.cv_macro_f1.mean.toFixed(3)} ± ${metadata.cv_macro_f1.std.toFixed(3)}`}
                        hint="Averaged across the three plan tiers, with fold-to-fold variation"
                    />
                    <Stat
                        label="Accuracy"
                        value={`${(metadata.cv_accuracy.mean * 100).toFixed(1)}%`}
                        hint={`Data ceiling ${(metadata.accuracy_ceiling * 100).toFixed(
                            1
                        )}% — identical profiles in the dataset carry different labels`}
                    />
                    {Object.entries(metadata.cv_recall_by_plan).map(([p, r]) => (
                        <Stat key={p} label={`${p} tier correctly caught`} value={`${(r * 100).toFixed(0)}%`} />
                    ))}
                </Panel>
            </div>
        </div>
    );
}

export default PredictionResult;
