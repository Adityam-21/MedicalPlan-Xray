import { Link } from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";

const REPO_URL = "https://github.com/Adityam-21";
const LINKEDIN_URL = "https://www.linkedin.com/in/kumar-adityam/";

// From `python -m src.train evaluate` on this repo: 5-fold stratified CV,
// seed 42, tuned models tuned inside the training folds only.
const RESULTS = [
    { model: "Decision tree, depth tuned (shipped)", f1: "0.814 ± 0.021", note: "Depth 2, one feature" },
    { model: "Decision tree, depth 3", f1: "0.815 ± 0.017", note: "Same score, chosen depth after the fact" },
    { model: "XGBoost, tuned", f1: "0.808 ± 0.028", note: "All features, nested tuning" },
    { model: "XGBoost, tuned + SMOTE", f1: "0.801 ± 0.037", note: "Oversampling did not help" },
    { model: "Previously deployed config", f1: "0.789 ± 0.033", note: "Re-scored without the test-set leak" },
    { model: "Logistic regression", f1: "0.726 ± 0.026", note: "Linear baseline" },
    { model: "Majority class", f1: "0.199 ± 0.001", note: "Floor" },
];

const FIXES = [
    {
        title: "Verified the label mapping instead of trusting it",
        body: "The saved class mapping is now checked against the encoder's own order by a test, and confirmed end to end through the API on known rows.",
    },
    {
        title: "Removed the tuning leak",
        body: "Hyperparameters were previously searched against the test set, which inflates the score. Tuning now runs inside the training folds only, so the reported number is honest.",
    },
    {
        title: "Dropped gender",
        body: "It changed macro-F1 by 0.001 — noise — while the labels were gender-skewed. The API still accepts the field for older clients, but ignores it.",
    },
    {
        title: "Dropped the row identifier",
        body: "user_id correlated with the label in this dataset. It is now excluded explicitly rather than by accident.",
    },
    {
        title: "Tests that check values, not shapes",
        body: "The old tests only checked that the response had the right keys. They now check predicted tiers, probability ordering, thresholds and the insight panels.",
    },
    {
        title: "Corrected the claims",
        body: "The model card claimed 87% F1; the cross-validated figure is 0.814 macro-F1. The badges and 'AI-powered' labels are gone.",
    },
];

const STACK = [
    ["Frontend", "React 19, Vite, Tailwind, React Router, React Hook Form"],
    ["API", "FastAPI, Pydantic validation, versioned v2 response"],
    ["Model", "scikit-learn decision tree in a fitted preprocessing pipeline"],
    ["Training", "Nested cross-validation script with a saved metrics and metadata file"],
    ["Logging", "Supabase table of predictions, disclosed on the form"],
];

function Section({ eyebrow, title, children, tone = "white" }) {
    return (
        <section className={`border-b border-slate-200 dark:border-slate-800 ${tone === "white" ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-950"}`}>
            <PageContainer size="xl" className="py-16">
                <p className="eyebrow">{eyebrow}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{title}</h2>
                <div className="mt-6">{children}</div>
            </PageContainer>
        </section>
    );
}

function About() {
    return (
        <div>
            <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <PageContainer size="xl" className="py-16 sm:py-20">
                    <p className="eyebrow">How it works</p>
                    <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        A simple model, an audited pipeline, and no inflated numbers
                    </h1>
                    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                        This project started as a tuned XGBoost model with SMOTE and a model card claiming 87% F1.
                        An audit found the score was measured against the test set it was tuned on. Here is what
                        replaced it.
                    </p>
                </PageContainer>
            </section>

            <Section eyebrow="The data" title="980 synthetic household profiles" tone="slate">
                <div className="grid gap-5 md:grid-cols-3">
                    <div className="panel shadow-panel">
                        <div className="panel-body">
                            <p className="font-mono text-2xl font-medium tabular-nums text-slate-900 dark:text-slate-100">980</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                rows, labelled Low (155), Medium (407) or High (418)
                            </p>
                        </div>
                    </div>
                    <div className="panel shadow-panel">
                        <div className="panel-body">
                            <p className="font-mono text-2xl font-medium tabular-nums text-slate-900 dark:text-slate-100">38</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                groups of identical profiles carry different labels
                            </p>
                        </div>
                    </div>
                    <div className="panel shadow-panel">
                        <div className="panel-body">
                            <p className="font-mono text-2xl font-medium tabular-nums text-slate-900 dark:text-slate-100">95.7%</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                the highest accuracy any model could reach on this data
                            </p>
                        </div>
                    </div>
                </div>
                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    That last figure matters. Because identical inputs sometimes carry different labels, a model
                    scoring 83% is closer to the ceiling than it first appears, and anything claiming near-perfect
                    accuracy on this dataset would be suspicious.
                </p>
            </Section>

            <Section eyebrow="Model selection" title="Every candidate, scored the same way">
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full min-w-[34rem] text-left text-sm">
                        <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                            <tr>
                                <th scope="col" className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">Model</th>
                                <th scope="col" className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">Macro-F1</th>
                                <th scope="col" className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                            {RESULTS.map((row, i) => (
                                <tr key={row.model} className={i === 0 ? "bg-indigo-50/40 dark:bg-indigo-950/30" : undefined}>
                                    <td className="px-5 py-3 text-slate-800 dark:text-slate-200">{row.model}</td>
                                    <td className="whitespace-nowrap px-5 py-3 font-mono tabular-nums text-slate-900 dark:text-slate-100">
                                        {row.f1}
                                    </td>
                                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{row.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    5-fold stratified cross-validation, seed 42. Tuned models use nested cross-validation, so the
                    search never sees the fold it is scored on.
                </p>
            </Section>

            <Section eyebrow="The finding" title="Why the simple model won" tone="slate">
                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        <p>
                            Gradient boosting with every feature scored 0.808. A decision tree two levels deep,
                            using annual household spending alone, scored 0.814. The gap is smaller than the
                            variation between folds, so the complex model was not better — just harder to explain.
                        </p>
                        <p>
                            The reason is in the data. Spending correlates strongly with age (0.61), smoking (0.57)
                            and family size (0.39), so it already carries most of what the other columns say.
                            Drop spending and keep everything else, and the score falls to about 0.72.
                        </p>
                        <p>
                            Choosing the tree bought something the boosted model could not offer: every prediction
                            comes with the exact threshold that produced it, the distance to the next tier, and the
                            count of training profiles behind the answer.
                        </p>
                    </div>
                    <div className="panel shadow-panel">
                        <div className="panel-header">
                            <h3 className="eyebrow">The shipped model, in full</h3>
                        </div>
                        <div className="panel-body space-y-3 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            <p>if spending ≤ ₹57,163 → <span className="font-semibold text-slate-900 dark:text-slate-100">Low</span></p>
                            <p>elif spending ≤ ₹1,39,918 → <span className="font-semibold text-slate-900 dark:text-slate-100">Medium</span></p>
                            <p>else → <span className="font-semibold text-slate-900 dark:text-slate-100">High</span></p>
                            <p className="border-t border-slate-100 dark:border-slate-800 pt-3 font-sans text-slate-500 dark:text-slate-400">
                                That is the entire decision rule. It is printed here because a model you can read
                                is a model you can check.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>

            <Section eyebrow="The audit" title="What was wrong, and what changed">
                <div className="grid gap-5 sm:grid-cols-2">
                    {FIXES.map((fix) => (
                        <div key={fix.title} className="panel shadow-panel">
                            <div className="panel-body">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{fix.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{fix.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section eyebrow="Limitations" title="What this model cannot tell you" tone="slate">
                <ul className="max-w-3xl space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        The data is synthetic. Patterns here need not hold for real households anywhere.
                    </li>
                    <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        Low tiers are caught about 63% of the time; Medium is often predicted instead.
                    </li>
                    <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        Inputs outside the training ranges are scored, but flagged as unreliable.
                    </li>
                    <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        A tier is not a product. Real cover depends on premiums, exclusions and underwriting that
                        this dataset knows nothing about.
                    </li>
                </ul>
            </Section>

            <Section eyebrow="Implementation" title="Stack and source">
                <dl className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {STACK.map(([label, value]) => (
                        <div key={label} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                            <dt className="w-40 shrink-0 text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</dt>
                            <dd className="text-sm text-slate-600 dark:text-slate-400">{value}</dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Read the code or get in touch</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            The training script, tests and model card are all in the repository.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-slate-900 dark:bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:hover:bg-indigo-500"
                        >
                            GitHub
                        </a>
                        <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-900 dark:hover:border-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                            LinkedIn
                        </a>
                        <Link
                            to="/predict"
                            className="rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-900 dark:hover:border-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                            Score a profile
                        </Link>
                    </div>
                </div>
            </Section>
        </div>
    );
}

export default About;
