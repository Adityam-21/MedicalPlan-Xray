import {
    ArrowRight,
    Sparkles,
    GitBranch,
    BrainCircuit,
} from "lucide-react";

import { Link } from "react-router-dom";

function CTA() {
    return (
        <section className="mt-32 mb-10">

            <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-8 py-16 text-white shadow-2xl">

                {/* Decorative Blur */}

                <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

                <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"></div>

                <div className="relative z-10 flex flex-col items-center text-center">

                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">

                        <BrainCircuit size={42} />

                    </div>

                    <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">

                        Portfolio Project

                    </p>

                    <h2 className="mt-4 max-w-4xl text-5xl font-black leading-tight">

                        Experience the Complete
                        <br />
                        Machine Learning Pipeline

                    </h2>

                    <p className="mt-8 max-w-3xl text-xl leading-9 text-blue-100">

                        MedicalPlan-Xray combines modern Machine Learning,
                        FastAPI, React and Supabase into a complete
                        production-style web application capable of making
                        intelligent medical insurance recommendations in
                        real-time.

                    </p>

                    {/* Project Highlights */}

                    <div className="mt-12 flex flex-wrap justify-center gap-4">

                        {[
                            "React",
                            "FastAPI",
                            "XGBoost",
                            "Supabase",
                            "Real-Time Prediction",
                            "Probability Scores",
                        ].map((item) => (

                            <span
                                key={item}
                                className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur"
                            >
                                {item}
                            </span>

                        ))}

                    </div>

                    {/* Buttons */}

                    <div className="mt-14 flex flex-wrap justify-center gap-5">

                        <Link
                            to="/predict"
                            className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >

                            Try Live Prediction

                            <ArrowRight
                                size={20}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />

                        </Link>

                        <a
                            href="https://github.com/Adityam-21/MedicalPlan-Xray"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                        >

                            <GitBranch size={20} />

                            View Source Code

                        </a>

                    </div>

                    <div className="mt-12 flex items-center gap-3 text-blue-100">

                        <Sparkles size={18} />

                        <span className="text-sm">

                            Built as an end-to-end Machine Learning portfolio project.

                        </span>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default CTA;