import { Link } from "react-router-dom";
import PageContainer from "../layout/PageContainer.jsx";
import Button from "../common/Button.jsx";
import Badge from "../common/Badge.jsx";

/* -------------------------------------------------------------------------- */
/*                            SVG Illustration                                */
/* -------------------------------------------------------------------------- */

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-56 w-56 md:h-72 md:w-72"
      aria-hidden="true"
    >
      {/* AI Network */}

      <g stroke="#67E8F9" strokeWidth="1.5" opacity="0.8">
        <line x1="40" y1="40" x2="80" y2="70" />
        <line x1="160" y1="40" x2="120" y2="70" />
        <line x1="40" y1="160" x2="80" y2="130" />
        <line x1="160" y1="160" x2="120" y2="130" />
      </g>

      <g fill="#06B6D4">
        <circle cx="40" cy="40" r="5" />
        <circle cx="160" cy="40" r="5" />
        <circle cx="40" cy="160" r="5" />
        <circle cx="160" cy="160" r="5" />
      </g>

      {/* Shield */}

      <path
        d="M100 22 L163 46 V94 C163 138 134 167 100 182 C66 167 37 138 37 94 V46 Z"
        fill="#EFF6FF"
        stroke="#2563EB"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Pulse */}

      <path
        d="M55 100 H78 L90 72 L106 128 L118 100 H145"
        fill="none"
        stroke="#2563EB"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Hero                                     */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-cyan-50 py-24">

      {/* Background Blur */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-blue-300/20 blur-3xl"></div>

        <div className="absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-cyan-300/20 blur-3xl"></div>

      </div>

      <PageContainer size="xl">

        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">

          {/* Left Side */}

          <div>

            <Badge
              variant="primary"
              className="mb-6"
            >
              🤖 AI Powered • XGBoost + SMOTE
            </Badge>

            <h1 className="text-5xl font-black leading-tight text-gray-900 lg:text-6xl">

              MedicalPlan-Xray

            </h1>

            <h2 className="mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-5xl font-black leading-tight text-transparent">

              AI Medical Insurance
              <br />
              Recommendation Platform

            </h2>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-gray-600">

              Receive personalized medical insurance recommendations using a
              Machine Learning model trained on demographic, financial and
              lifestyle attributes with explainable probability scores.

            </p>

            {/* Tech Pills */}

            <div className="mt-10 flex flex-wrap gap-3">

              {[
                "React",
                "FastAPI",
                "XGBoost",
                "Supabase",
                "Real-Time",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                >
                  {item}
                </span>
              ))}

            </div>

            {/* Buttons */}

            <div className="mt-12 flex flex-wrap gap-4">

              <Link
                to="/predict"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Predict My Plan
              </Link>

              <Link
                to="/about"
                className="rounded-xl border-2 border-blue-600 bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-xl"
              >
                Learn More
              </Link>

            </div>
          </div>

          {/* Right Side */}

          <div className="relative flex items-center justify-center">

            {/* Floating Cards */}

            <div className="absolute left-0 top-6 rounded-2xl bg-white px-5 py-3 shadow-xl animate-float">

              <p className="text-xs uppercase text-gray-500">

                Confidence

              </p>

              <p className="font-bold text-green-600">

                92%

              </p>

            </div>

            <div className="absolute right-0 top-12 rounded-2xl bg-white px-5 py-3 shadow-xl animate-float-delay">

              <p className="text-xs uppercase text-gray-500">

                Model

              </p>

              <p className="font-bold">

                XGBoost

              </p>

            </div>

            <div className="absolute bottom-8 left-2 rounded-2xl bg-white px-5 py-3 shadow-xl animate-float-delay-2">

              <p className="text-xs uppercase text-gray-500">

                Backend

              </p>

              <p className="font-bold">

                FastAPI

              </p>

            </div>

            <div className="absolute bottom-0 right-8 rounded-2xl bg-white px-5 py-3 shadow-xl animate-float">

              <p className="text-xs uppercase text-gray-500">

                Database

              </p>

              <p className="font-bold">

                Supabase

              </p>

            </div>

            {/* Main Card */}

            <div className="relative flex min-h-[470px] w-full items-center justify-center overflow-hidden rounded-[36px] border border-white/70 bg-white/70 backdrop-blur-xl shadow-2xl">

              <div className="animate-float">
                <HeroIllustration />
              </div>

            </div>

          </div>

        </div>

      </PageContainer>

    </section>
  );
}

export default Hero;