import { useEffect, useRef, useState } from "react";

import PredictionForm from "../components/predict/PredictionForm";
import PredictionResult from "../components/predict/PredictionResult";
import PageContainer from "../components/layout/PageContainer";
import { formatINR } from "../utils/format";

const STRIP_FIELDS = [
    ["age", "Age", (v) => v],
    ["family_members", "Family", (v) => `${v} people`],
    ["state_tier", "State tier", (v) => v],
    ["occupation_class", "Occupation", (v) => v],
    ["total_income_inr", "Income", formatINR],
    ["annual_expenditure_inr", "Spending", formatINR],
    ["is_smoker", "Smoker", (v) => (Number(v) === 1 ? "Yes" : "No")],
];

/** Compact read-back of the scored profile, so the form can collapse. */
function ProfileStrip({ inputs, bracket, onEdit }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">
                    Profile scored
                </h2>
                <button
                    type="button"
                    onClick={onEdit}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                    Edit inputs
                </button>
            </div>
            <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                {STRIP_FIELDS.map(([key, label, format]) => (
                    <div key={key}>
                        <dt className="text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
                        <dd className="text-sm font-semibold tabular-nums text-slate-900">
                            {format(inputs[key])}
                        </dd>
                    </div>
                ))}
                <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">Income bracket</dt>
                    <dd className="text-sm font-semibold text-slate-900">{bracket}</dd>
                </div>
            </dl>
        </div>
    );
}

function Predict() {
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const reportRef = useRef(null);

    useEffect(() => {
        if (prediction || error) {
            reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [prediction, error]);

    const handleStart = () => {
        setIsLoading(true);
        setError(null);
    };

    const handleResult = (result) => {
        setPrediction(result);
        setIsLoading(false);
        setShowForm(false);
    };

    const handleError = (message) => {
        setError(message);
        setPrediction(null);
        setIsLoading(false);
        setShowForm(true);
    };

    const hasReport = Boolean(prediction || isLoading || error);

    return (
        <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
            <PageContainer size="xl">
                <header className={hasReport ? "max-w-3xl" : "mx-auto max-w-3xl text-center"}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700">
                        Plan tier screening
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Which insurance plan tier fits this profile?
                    </h1>
                    <p className="mt-3 text-slate-600">
                        A decision tree trained on 980 synthetic household profiles suggests a Low, Medium or High
                        plan tier, and shows the spending thresholds behind the answer. Educational demo, not
                        insurance advice.
                    </p>
                </header>

                <div className={`mt-8 space-y-5 ${hasReport ? "" : "mx-auto max-w-3xl"}`}>
                    {showForm ? (
                        <PredictionForm
                            onStart={handleStart}
                            onResult={handleResult}
                            onError={handleError}
                        />
                    ) : (
                        <ProfileStrip
                            inputs={prediction.inputs}
                            bracket={prediction.derived.salary_bracket_label}
                            onEdit={() => setShowForm(true)}
                        />
                    )}

                    <div ref={reportRef} className="scroll-mt-24">
                        <PredictionResult
                            prediction={prediction}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </div>
            </PageContainer>
        </div>
    );
}

export default Predict;
