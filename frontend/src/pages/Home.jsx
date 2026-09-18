import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";
import { getModelInfo } from "../services/api";

// The live model's thresholds (model v2.0.0). Shown as an illustration; the
// report on the Predict page always reads them from the model itself.
const TIERS = [
    { plan: "Low", range: "up to ₹57,163", bar: "bg-sky-300", width: "w-[18%]" },
    { plan: "Medium", range: "₹57,163 – ₹1,39,918", bar: "bg-indigo-400", width: "w-[42%]" },
    { plan: "High", range: "above ₹1,39,918", bar: "bg-indigo-700", width: "w-[40%]" },
];

const STEPS = [
    {
        n: "01",
        title: "Describe the household",
        body: "Seven details: age, family size, location tier, occupation risk, income, annual spending and smoking status. No name, no contact details.",
    },
    {
        n: "02",
        title: "The model applies its thresholds",
        body: "A decision tree compares annual household spending against the boundaries it learned, and reads off the tier from the matching band.",
    },
    {
        n: "03",
        title: "Read the reasoning, not just the label",
        body: "You get the tier, the exact threshold that decided it, how far the profile sits from the next tier, and how it compares with 980 training profiles.",
    },
];

const DOES = [
    "Shows the threshold that produced the answer",
    "Flags close calls instead of hiding them",
    "Warns when inputs fall outside the training range",
    "Reports its own cross-validated accuracy, including where it fails",
];

const DOES_NOT = [
    "Recommend a real insurance product or provider",
    "Use gender, which added nothing and skewed the data",
    "Claim causation from patterns in a synthetic dataset",
    "Replace advice from a licensed adviser",
];

function Stat({ label, value, hint }) {
    return (
        <div className="px-5 py-4">
            <p className="eyebrow">{label}</p>
            <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-slate-900 dark:text-slate-100">{value}</p>
            {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
        </div>
    );
}

function Home() {
    const [model, setModel] = useState(null);

    useEffect(() => {
        let active = true;
        getModelInfo()
            .then((info) => active && setModel(info))
            .catch(() => active && setModel(null));
        return () => {
            active = false;
        };
    }, []);

    return (
        <div>
            {/* Hero */}
            <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <PageContainer size="xl" className="py-16 sm:py-20">
                    <div className="grid items-center gap-12 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <p className="eyebrow">Interpretable ML · synthetic data · portfolio project</p>
                            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                                Which insurance plan tier fits a household — and{" "}
                                <span className="text-gradient">why</span>?
                            </h1>
                            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                Most demos hand you a label and a confidence score. This one shows the rule that
                                produced the answer, how close the call was, and what the training data actually
                                supports.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to="/predict"
                                    className="rounded-lg bg-slate-900 dark:bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:hover:bg-indigo-500"
                                >
                                    Score a profile
                                </Link>
                                <Link
                                    to="/about"
                                    className="rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-900 dark:hover:border-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                                >
                                    How it was built
                                </Link>
                            </div>
                            <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
                                Educational demo trained on 980 synthetic household profiles. Not insurance,
                                financial or medical advice.
                            </p>
                        </div>

                        {/* Threshold illustration */}
                        <div className="lg:col-span-5">
                            <div className="panel shadow-panel">
                                <div className="panel-header">
                                    <h2 className="eyebrow">The whole model, in one chart</h2>
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500">v2.0.0</span>
                                </div>
                                <div className="panel-body space-y-4">
                                    {TIERS.map((tier) => (
                                        <div key={tier.plan}>
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                    {tier.plan}
                                                </span>
                                                <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                                                    {tier.range}
                                                </span>
                                            </div>
                                            <div className={`mt-1.5 h-2 rounded-sm ${tier.bar} ${tier.width}`} />
                                        </div>
                                    ))}
                                    <p className="border-t border-slate-100 dark:border-slate-800 pt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Annual household spending decides the tier. Everything else the form asks
                                        for is shown as context, because adding it did not improve accuracy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </PageContainer>
            </section>

            {/* Flow */}
            <section className="border-b border-slate-200 bg-slate-50 dark:bg-slate-950">
                <PageContainer size="xl" className="py-16">
                    <p className="eyebrow">How it works</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Three steps, start to finish
                    </h2>
                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <div key={step.n} className="relative panel shadow-panel">
                                <div className="panel-body">
                                    <span className="font-mono font-medium text-indigo-700 dark:text-indigo-300">{step.n}</span>
                                    <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 md:flex"
                                    >
                                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-8">
                        <Link
                            to="/predict"
                            className="text-sm font-semibold dark:text-indigo-300 transition hover:text-indigo-900 dark:hover:text-indigo-200"
                        >
                            Start with an example profile →
                        </Link>
                    </div>
                </PageContainer>
            </section>

            {/* Live model facts */}
            <section className="border-b dark:bg-slate-900">
                <PageContainer size="xl" className="py-16">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                            <p className="eyebrow">Measured performance</p>
                            <h2 className="mt-2 font-bold tracking-tight sm:text-3xl">
                                Numbers from the live model
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {model ? "Read from the running API" : "Start the API to load live figures"}
                        </p>
                    </div>

                    <div className="mt-6 grid divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
                        <Stat
                            label="Macro-F1"
                            value={model ? `${model.cv_macro_f1.mean.toFixed(3)}` : "—"}
                            hint={model ? `± ${model.cv_macro_f1.std.toFixed(3)} across ${model.cv_folds} folds` : "5-fold cross-validation"}
                        />
                        <Stat
                            label="Accuracy"
                            value={model ? `${(model.cv_accuracy.mean * 100).toFixed(1)}%` : "—"}
                            hint={model ? `Data ceiling ${(model.accuracy_ceiling * 100).toFixed(1)}%` : "Against the data's own ceiling"}
                        />
                        <Stat
                            label="Training profiles"
                            value={model ? model.training_rows : "—"}
                            hint="Synthetic households"
                        />
                        <Stat
                            label="Weakest tier"
                            value={model ? `Low ${(model.cv_recall_by_plan.Low * 100).toFixed(0)}%` : "—"}
                            hint="Share correctly caught"
                        />
                    </div>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        Every figure comes from cross-validation on held-out folds, including the one that is
                        unflattering.
                    </p>
                </PageContainer>
            </section>

            {/* Scope */}
            <section className="bg-slate-50 dark:bg-slate-800/60 dark:bg-slate-950">
                <PageContainer size="xl" className="py-16">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="panel shadow-panel">
                            <div className="panel-header">
                                <h2 className="eyebrow">What it does</h2>
                            </div>
                            <ul className="panel-body space-y-2.5">
                                {DOES.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="panel shadow-panel">
                            <div className="panel-header">
                                <h2 className="eyebrow">What it does not do</h2>
                            </div>
                            <ul className="panel-body space-y-2.5">
                                {DOES_NOT.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">See it on a real profile</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Three example households are one click away, or enter your own numbers.
                            </p>
                        </div>
                        <Link
                            to="/predict"
                            className="rounded-lg bg-slate-900 dark:bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:hover:bg-indigo-500"
                        >
                            Score a profile
                        </Link>
                    </div>
                </PageContainer>
            </section>
        </div>
    );
}

export default Home;
