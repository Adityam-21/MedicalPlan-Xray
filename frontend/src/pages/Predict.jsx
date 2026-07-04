import { useState } from "react";

import PredictionForm from "../components/predict/PredictionForm";
import PredictionResult from "../components/predict/PredictionResult";

function Predict() {
    const [prediction, setPrediction] = useState(null);

    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/30 py-16">

            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10 overflow-hidden">

                {/* Blue Glow */}
                <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-300/15 blur-3xl"></div>

                {/* Emerald Glow */}
                <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-emerald-300/15 blur-3xl"></div>

                {/* Cyan Glow */}
                <div className="absolute left-1/3 bottom-20 h-80 w-80 rounded-full bg-cyan-200/10 blur-3xl"></div>

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#64748b 1px, transparent 1px), linear-gradient(to right,#64748b 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                    }}
                />
            </div>

            <div className="mx-auto max-w-7xl px-6">

                {/* Hero */}
                <div className="mb-16 text-center">

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                        🤖 AI Powered • XGBoost + SMOTE
                    </div>

                    <h1 className="text-5xl font-black tracking-tight text-gray-900">
                        AI Medical Plan
                    </h1>

                    <h2 className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-black text-transparent">
                        Recommendation System
                    </h2>

                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                        Receive an intelligent insurance recommendation using a machine
                        learning model trained on demographic, lifestyle and financial
                        attributes with explainable probability scores.
                    </p>

                    {/* Stats */}
                    <div className="mt-10 flex flex-wrap justify-center gap-5">

                        <div className="rounded-2xl bg-white px-6 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Model
                            </p>

                            <p className="mt-1 font-bold">
                                XGBoost + SMOTE
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white px-6 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Predictions
                            </p>

                            <p className="mt-1 font-bold">
                                Real-time
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white px-6 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Output
                            </p>

                            <p className="mt-1 font-bold">
                                Confidence Scores
                            </p>
                        </div>

                    </div>

                </div>

                {/* Prediction Area */}
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

                    <PredictionForm
                        onPrediction={setPrediction}
                    />

                    <PredictionResult
                        prediction={prediction}
                    />

                </div>

            </div>

        </main>
    );
}

export default Predict;