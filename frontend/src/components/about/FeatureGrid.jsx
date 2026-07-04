import {
    BrainCircuit,
    Activity,
    ShieldCheck,
    Database,
    BarChart3,
    Smartphone,
} from "lucide-react";

import Card from "../common/Card";

const features = [
    {
        icon: BrainCircuit,
        title: "AI Recommendation Engine",
        description:
            "Uses an optimized XGBoost model with SMOTE balancing to recommend the most suitable medical insurance plan.",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Activity,
        title: "Real-Time Prediction",
        description:
            "FastAPI performs inference in real time and instantly returns confidence scores to the frontend.",
        color: "text-green-600",
        bg: "bg-green-50",
    },
    {
        icon: BarChart3,
        title: "Explainable Results",
        description:
            "Displays probability distribution across Low, Medium and High plans for transparent decision making.",
        color: "text-orange-500",
        bg: "bg-orange-50",
    },
    {
        icon: Database,
        title: "Prediction Logging",
        description:
            "Every successful prediction is automatically stored in Supabase for auditing and future analytics.",
        color: "text-cyan-600",
        bg: "bg-cyan-50",
    },
    {
        icon: ShieldCheck,
        title: "Smart Validation",
        description:
            "Robust client-side validation ensures clean inputs before the request reaches the prediction API.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        icon: Smartphone,
        title: "Responsive Experience",
        description:
            "Designed with reusable React components and Tailwind CSS for a smooth experience across all devices.",
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
];

function FeatureGrid() {
    return (
        <section className="mt-28">

            <div className="mx-auto max-w-3xl text-center">

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    Core Capabilities
                </p>

                <h2 className="mt-4 text-5xl font-black text-gray-900">
                    Designed for Production
                </h2>

                <p className="mt-6 text-xl leading-8 text-gray-600">
                    MedicalPlan-Xray combines modern machine learning with a
                    scalable web architecture to deliver fast, reliable and
                    interpretable insurance recommendations.
                </p>

            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                {features.map((feature) => {

                    const Icon = feature.icon;

                    return (

                        <Card
                            key={feature.title}
                            padding="lg"
                            className="group border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
                        >

                            <div
                                className={`flex h-18 w-18 items-center justify-center rounded-2xl ${feature.bg} transition-all duration-300 group-hover:scale-110`}
                            >

                                <Icon
                                    size={34}
                                    className={feature.color}
                                />

                            </div>

                            <h3 className="mt-7 text-2xl font-bold text-gray-900">

                                {feature.title}

                            </h3>

                            <p className="mt-5 leading-8 text-gray-600">

                                {feature.description}

                            </p>

                        </Card>

                    );

                })}

            </div>

        </section>
    );
}

export default FeatureGrid;