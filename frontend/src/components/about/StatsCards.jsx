import {
    BrainCircuit,
    Database,
    Server,
    Layers3,
    Clock3,
    BarChart3,
} from "lucide-react";

import Card from "../common/Card";

const stats = [
    {
        icon: BrainCircuit,
        title: "Machine Learning",
        value: "XGBoost + SMOTE",
        description: "Champion model after experimentation",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Layers3,
        title: "Prediction Classes",
        value: "3",
        description: "Low • Medium • High",
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
    {
        icon: Server,
        title: "Backend API",
        value: "FastAPI",
        description: "RESTful prediction service",
        color: "text-green-600",
        bg: "bg-green-50",
    },
    {
        icon: Database,
        title: "Database",
        value: "Supabase",
        description: "Prediction history logging",
        color: "text-cyan-600",
        bg: "bg-cyan-50",
    },
    {
        icon: Clock3,
        title: "Inference",
        value: "Real-Time",
        description: "Instant AI recommendations",
        color: "text-orange-500",
        bg: "bg-orange-50",
    },
    {
        icon: BarChart3,
        title: "Output",
        value: "Confidence",
        description: "Probability distribution",
        color: "text-red-500",
        bg: "bg-red-50",
    },
];

function StatsCards() {
    return (
        <section className="mt-28">

            <div className="mx-auto max-w-3xl text-center">

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    Project Summary
                </p>

                <h2 className="mt-4 text-5xl font-black text-gray-900">
                    Project Overview
                </h2>

                <p className="mt-6 text-xl leading-8 text-gray-600">
                    MedicalPlan-Xray combines modern Machine Learning with a
                    production-ready web stack to deliver fast, interpretable
                    insurance recommendations.
                </p>

            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                {stats.map((item) => {

                    const Icon = item.icon;

                    return (

                        <Card
                            key={item.title}
                            padding="lg"
                            className="group border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">

                                        {item.title}

                                    </p>

                                    <h3 className="mt-3 text-3xl font-black text-gray-900">

                                        {item.value}

                                    </h3>

                                </div>

                                <div
                                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} transition-transform duration-300 group-hover:scale-110`}
                                >

                                    <Icon
                                        size={34}
                                        className={item.color}
                                    />

                                </div>

                            </div>

                            <div className="mt-8 h-px bg-gray-100"></div>

                            <p className="mt-6 leading-7 text-gray-600">

                                {item.description}

                            </p>

                        </Card>

                    );

                })}

            </div>

        </section>
    );
}

export default StatsCards;