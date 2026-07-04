import {
    Brain,
    ShieldCheck,
    Database,
    Activity,
    Sparkles,
} from "lucide-react";

import Card from "../common/Card";

const highlights = [
    {
        icon: Brain,
        title: "Machine Learning",
        value: "XGBoost + SMOTE",
        color: "text-blue-600",
    },
    {
        icon: Activity,
        title: "Backend",
        value: "FastAPI",
        color: "text-emerald-600",
    },
    {
        icon: Database,
        title: "Database",
        value: "Supabase",
        color: "text-indigo-600",
    },
    {
        icon: ShieldCheck,
        title: "Inference",
        value: "Real-Time",
        color: "text-amber-500",
    },
];

function Hero() {
    return (
        <section className="relative py-10 text-center">

            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm">

                <Sparkles size={16} />

                AI Powered • XGBoost + SMOTE

            </div>

            {/* Main Heading */}

            <h1 className="mt-8 text-6xl font-black tracking-tight text-gray-900 md:text-7xl">

                MedicalPlan-Xray

            </h1>

            <h2 className="mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-5xl font-black leading-tight text-transparent md:text-6xl">

                AI Medical Insurance

                <br />

                Recommendation System

            </h2>

            {/* Description */}

            <p className="mx-auto mt-8 max-w-4xl text-xl leading-9 text-gray-600">

                MedicalPlan-Xray is an end-to-end Machine Learning application
                that intelligently recommends the most suitable medical insurance
                plan using customer demographic, financial and lifestyle
                attributes.

                <br />

                <br />

                Built with a production-ready architecture using

                <span className="font-semibold text-gray-900">
                    {" "}React
                </span>,

                <span className="font-semibold text-gray-900">
                    {" "}FastAPI
                </span>,

                <span className="font-semibold text-gray-900">
                    {" "}XGBoost
                </span>

                and

                <span className="font-semibold text-gray-900">
                    {" "}Supabase
                </span>

                for seamless real-time prediction and logging.

            </p>

            {/* Highlight Cards */}

            <div className="mt-20 grid grid-cols-2 gap-7 lg:grid-cols-4">

                {highlights.map((item) => {

                    const Icon = item.icon;

                    return (

                        <Card
                            key={item.title}
                            padding="lg"
                            className="group text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >

                            <div
                                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 transition-all duration-300 group-hover:scale-110 ${item.color}`}
                            >

                                <Icon size={34} />

                            </div>

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">

                                {item.title}

                            </p>

                            <h3 className="mt-3 text-xl font-bold text-gray-900">

                                {item.value}

                            </h3>

                        </Card>

                    );

                })}

            </div>

        </section>
    );
}

export default Hero;