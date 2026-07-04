import {
    BadgeCheck,
    BrainCircuit,
    Database,
    Server,
    Monitor,
    Wind,
    Boxes,
    GitBranch,
} from "lucide-react";

import Card from "../common/Card";

const technologies = [
    {
        icon: Monitor,
        name: "React 19",
        category: "Frontend",
        description: "Reusable component architecture with React Router.",
        color: "text-sky-600",
        bg: "bg-sky-50",
    },
    {
        icon: Wind,
        name: "Tailwind CSS",
        category: "Styling",
        description: "Utility-first responsive UI with consistent design.",
        color: "text-cyan-600",
        bg: "bg-cyan-50",
    },
    {
        icon: Server,
        name: "FastAPI",
        category: "Backend",
        description: "High-performance REST API serving ML predictions.",
        color: "text-green-600",
        bg: "bg-green-50",
    },
    {
        icon: BrainCircuit,
        name: "XGBoost",
        category: "Machine Learning",
        description: "Champion model trained using engineered features.",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Database,
        name: "Supabase",
        category: "Database",
        description: "Stores prediction history and metadata securely.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        icon: Boxes,
        name: "Scikit-Learn",
        category: "ML Toolkit",
        description: "Preprocessing, pipelines and feature engineering.",
        color: "text-orange-500",
        bg: "bg-orange-50",
    },
    {
        icon: GitBranch,
        name: "Git & GitHub",
        category: "Version Control",
        description: "Source control, collaboration and deployment.",
        color: "text-gray-700",
        bg: "bg-gray-100",
    },
    {
        icon: BadgeCheck,
        name: "REST API",
        category: "Communication",
        description: "React ↔ FastAPI interaction through JSON APIs.",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
];

function TechStack() {
    return (
        <section className="mt-28">

            <div className="mx-auto max-w-3xl text-center">

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    Technologies
                </p>

                <h2 className="mt-4 text-5xl font-black text-gray-900">
                    Built With Modern Tools
                </h2>

                <p className="mt-6 text-xl leading-8 text-gray-600">
                    A carefully selected technology stack powering the entire
                    Machine Learning pipeline from frontend to deployment.
                </p>

            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

                {technologies.map((tech) => {

                    const Icon = tech.icon;

                    return (

                        <Card
                            key={tech.name}
                            padding="lg"
                            className="group border border-gray-100 text-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
                        >

                            <div
                                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${tech.bg} transition-all duration-300 group-hover:scale-110`}
                            >

                                <Icon
                                    size={38}
                                    className={tech.color}
                                />

                            </div>

                            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">

                                {tech.category}

                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-gray-900">

                                {tech.name}

                            </h3>

                            <p className="mt-4 leading-7 text-gray-600">

                                {tech.description}

                            </p>

                        </Card>

                    );

                })}

            </div>

        </section>
    );
}

export default TechStack;