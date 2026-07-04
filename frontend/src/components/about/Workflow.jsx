import {
    Database,
    SearchCheck,
    Wrench,
    BrainCircuit,
    Server,
    Cloud,
    MonitorSmartphone,
    ArrowRight,
} from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Database,
        title: "Dataset",
        description: "Raw customer insurance records collected for training.",
        color: "bg-blue-100 text-blue-600",
    },
    {
        number: "02",
        icon: SearchCheck,
        title: "EDA",
        description: "Data cleaning, visualization and business insights.",
        color: "bg-green-100 text-green-600",
    },
    {
        number: "03",
        icon: Wrench,
        title: "Feature Engineering",
        description: "Encoding, transformations and feature creation.",
        color: "bg-orange-100 text-orange-600",
    },
    {
        number: "04",
        icon: BrainCircuit,
        title: "XGBoost + SMOTE",
        description: "Model training and intelligent prediction.",
        color: "bg-indigo-100 text-indigo-600",
    },
    {
        number: "05",
        icon: Server,
        title: "FastAPI",
        description: "Production-ready REST API for inference.",
        color: "bg-cyan-100 text-cyan-600",
    },
    {
        number: "06",
        icon: Cloud,
        title: "Supabase",
        description: "Stores prediction history and metadata.",
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        number: "07",
        icon: MonitorSmartphone,
        title: "React Frontend",
        description: "Interactive user interface with live predictions.",
        color: "bg-purple-100 text-purple-600",
    },
];

function Workflow() {
    return (
        <section className="mt-28">

            <div className="mx-auto max-w-3xl text-center">

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    Machine Learning Pipeline
                </p>

                <h2 className="mt-4 text-5xl font-black text-gray-900">
                    End-to-End Workflow
                </h2>

                <p className="mt-6 text-xl leading-8 text-gray-600">
                    Every prediction follows a structured production workflow,
                    beginning with raw customer information and ending with a
                    real-time recommendation delivered through the web
                    application.
                </p>

            </div>

            <div className="mt-20">

                <div className="grid gap-8 lg:grid-cols-7">

                    {steps.map((step, index) => {

                        const Icon = step.icon;

                        return (

                            <div
                                key={step.number}
                                className="relative flex flex-col items-center"
                            >

                                {/* Number Badge */}

                                <div className="absolute -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg">

                                    {step.number}

                                </div>

                                {/* Card */}

                                <div className="group flex h-full w-full flex-col items-center rounded-3xl border border-gray-200 bg-white px-6 pb-8 pt-10 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

                                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}>

                                        <Icon size={34} />

                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900">

                                        {step.title}

                                    </h3>

                                    <p className="mt-4 text-sm leading-7 text-gray-600">

                                        {step.description}

                                    </p>

                                </div>

                                {index !== steps.length - 1 && (

                                    <ArrowRight
                                        size={24}
                                        className="absolute -right-6 top-1/2 hidden -translate-y-1/2 text-blue-400 lg:block"
                                    />

                                )}

                            </div>

                        );

                    })}

                </div>

            </div>

        </section>
    );
}

export default Workflow;