import {
    Monitor,
    ArrowDown,
    Server,
    BrainCircuit,
    Database,
    ArrowRight,
} from "lucide-react";

const architecture = [
    {
        icon: Monitor,
        title: "React Frontend",
        subtitle: "User Interface",
        description:
            "Collects customer information through reusable React components.",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Server,
        title: "FastAPI",
        subtitle: "REST API",
        description:
            "Validates requests and executes the complete prediction pipeline.",
        color: "text-green-600",
        bg: "bg-green-50",
    },
    {
        icon: BrainCircuit,
        title: "ML Pipeline",
        subtitle: "XGBoost + SMOTE",
        description:
            "Performs feature engineering and predicts the insurance plan.",
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
    {
        icon: Database,
        title: "Supabase",
        subtitle: "Prediction Logging",
        description:
            "Stores prediction history and metadata for future analysis.",
        color: "text-cyan-600",
        bg: "bg-cyan-50",
    },
];

function Architecture() {
    return (
        <section className="mt-28">

            <div className="mx-auto max-w-3xl text-center">

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    System Design
                </p>

                <h2 className="mt-4 text-5xl font-black text-gray-900">
                    Production Architecture
                </h2>

                <p className="mt-6 text-xl leading-8 text-gray-600">
                    Every prediction travels through a complete Machine Learning
                    pipeline—from the user interface to backend inference and
                    secure database logging.
                </p>

            </div>

            <div className="mt-20 hidden lg:flex items-center justify-center">

                {architecture.map((layer, index) => {

                    const Icon = layer.icon;

                    return (
                        <div
                            key={layer.title}
                            className="flex items-center"
                        >

                            <div className="group w-72 rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl">

                                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${layer.bg}`}>

                                    <Icon
                                        size={40}
                                        className={layer.color}
                                    />

                                </div>

                                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">

                                    {layer.subtitle}

                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-gray-900">

                                    {layer.title}

                                </h3>

                                <p className="mt-5 leading-7 text-gray-600">

                                    {layer.description}

                                </p>

                            </div>

                            {index !== architecture.length - 1 && (

                                <ArrowRight
                                    size={36}
                                    className="mx-6 text-blue-400"
                                />

                            )}

                        </div>
                    );

                })}

            </div>

            {/* Mobile Layout */}

            <div className="mt-20 lg:hidden space-y-6">

                {architecture.map((layer, index) => {

                    const Icon = layer.icon;

                    return (

                        <div
                            key={layer.title}
                            className="text-center"
                        >

                            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md">

                                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${layer.bg}`}>

                                    <Icon
                                        size={38}
                                        className={layer.color}
                                    />

                                </div>

                                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">

                                    {layer.subtitle}

                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-gray-900">

                                    {layer.title}

                                </h3>

                                <p className="mt-5 leading-7 text-gray-600">

                                    {layer.description}

                                </p>

                            </div>

                            {index !== architecture.length - 1 && (

                                <ArrowDown
                                    size={34}
                                    className="mx-auto my-5 text-blue-400"
                                />

                            )}

                        </div>

                    );

                })}

            </div>

        </section>
    );
}

export default Architecture;