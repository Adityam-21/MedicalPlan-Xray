import { useEffect, useState } from "react";

import Card from "../common/Card";
import ProbabilityBar from "./ProbabilityBar";

function PredictionResult({ prediction }) {
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (prediction) {
            setShowResult(false);

            const timer = setTimeout(() => {
                setShowResult(true);
            }, 900);

            return () => clearTimeout(timer);
        }
    }, [prediction]);

    if (!prediction) {
        return (
            <Card className="h-full">
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                    Prediction Result
                </h2>

                <div className="flex h-[420px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-slate-50 to-white">
                    <div className="text-center">
                        <div className="mb-4 text-6xl">🤖</div>

                        <h3 className="text-lg font-semibold text-gray-700">
                            AI Recommendation
                        </h3>

                        <p className="mt-2 max-w-xs text-gray-500">
                            Fill in the customer information and press
                            <span className="font-semibold text-primary-600">
                                {" "}
                                Predict Plan
                            </span>{" "}
                            to receive an AI recommendation.
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    if (!showResult) {
        return (
            <Card className="h-full flex items-center justify-center">
                <div className="text-center">

                    <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

                    <h3 className="text-2xl font-bold text-gray-800">
                        AI is analysing the customer...
                    </h3>

                    <p className="mt-3 text-gray-500">
                        Running the XGBoost model and calculating probabilities.
                    </p>

                    <div className="mt-8 h-2 w-72 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full w-full animate-pulse rounded-full bg-blue-600"></div>
                    </div>

                </div>
            </Card>
        );
    }

    const result = prediction.prediction;

    const color =
        result.recommended_plan === "High"
            ? "text-red-600"
            : result.recommended_plan === "Medium"
                ? "text-yellow-500"
                : "text-green-600";

    return (
        <Card className="h-full">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                    Prediction Result
                </h2>

                <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                    <span className="relative flex h-2.5 w-2.5">

                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>

                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>

                    </span>

                    AI Powered

                </div>
            </div>

            <div className="rounded-xl border border-primary-100 bg-gradient-to-r from-primary-50 to-white p-6">

                <p className="text-sm uppercase tracking-wide text-gray-500">
                    Recommended Plan
                </p>

                <h1 className={`mt-2 text-5xl font-extrabold ${color}`}>
                    {result.recommended_plan}
                </h1>

                <p className="mt-4 text-sm text-gray-500">
                    Confidence
                </p>

                <p className="text-3xl font-bold text-gray-900">
                    {result.confidence.toFixed(2)}%
                </p>

            </div>

            <div className="mt-8 space-y-5">

                <ProbabilityBar
                    label="Low"
                    value={result.probabilities.Low}
                />

                <ProbabilityBar
                    label="Medium"
                    value={result.probabilities.Medium}
                />

                <ProbabilityBar
                    label="High"
                    value={result.probabilities.High}
                />

            </div>

            <div className="mt-8 rounded-xl bg-gray-50 p-5">

                <div className="flex justify-between border-b pb-3">
                    <span className="font-medium text-gray-600">
                        Model
                    </span>

                    <span className="font-semibold">
                        {prediction.metadata.model_name}
                    </span>
                </div>

                <div className="mt-3 flex justify-between">
                    <span className="font-medium text-gray-600">
                        Version
                    </span>

                    <span className="font-semibold">
                        {prediction.metadata.model_version}
                    </span>
                </div>

            </div>
        </Card>
    );
}

export default PredictionResult;