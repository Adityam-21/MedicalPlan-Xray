import {
  Brain,
  Activity,
  ShieldCheck,
  Database,
  BarChart3,
  Sparkles,
} from "lucide-react";

import Card from "../common/Card.jsx";
import PageContainer from "../layout/PageContainer.jsx";

const features = [
  {
    icon: Brain,
    title: "AI Recommendation Engine",
    description:
      "XGBoost + SMOTE model trained on engineered demographic, lifestyle and financial features to recommend the most suitable medical insurance plan.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Activity,
    title: "Real-Time Prediction",
    description:
      "FastAPI serves predictions instantly with probability scores and confidence values for every recommendation.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: BarChart3,
    title: "Explainable Confidence",
    description:
      "Displays probability distribution across Low, Medium and High plans instead of returning only a single prediction.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: ShieldCheck,
    title: "Production Ready",
    description:
      "Input validation, reusable React components, responsive UI and structured backend architecture suitable for deployment.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Database,
    title: "Prediction Logging",
    description:
      "Every prediction is stored securely in Supabase for persistence, analytics and future model monitoring.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Sparkles,
    title: "Modern Full-Stack App",
    description:
      "Built using React, Tailwind CSS, FastAPI, Supabase and Machine Learning following a modular production-style architecture.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

function FeatureHighlights() {
  return (
    <section className="py-24">
      <PageContainer size="xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Key Highlights
          </span>

          <h2 className="mt-6 text-4xl font-black text-gray-900 md:text-5xl">
            Everything Required for a
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Production-Style ML Application
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            MedicalPlan-Xray combines Machine Learning, Backend APIs, Database
            Integration and a modern React frontend into a complete end-to-end
            deployment-ready application.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg}`}
                >
                  <Icon className={feature.color} size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}

export default FeatureHighlights;