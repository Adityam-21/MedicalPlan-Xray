import { Link } from 'react-router-dom'
import PageContainer from '../layout/PageContainer.jsx'
import Button from '../common/Button.jsx'
import Badge from '../common/Badge.jsx'

/**
 * Original inline illustration — abstract shield (health/protection) with
 * a heartbeat pulse line and small connected nodes (AI/data motif).
 * Built from basic shapes rather than an external asset or icon library.
 */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="h-44 w-44 sm:h-56 sm:w-56" aria-hidden="true">
      {/* AI network nodes, connected to the shield */}
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

      {/* Heartbeat pulse line */}
      <path
        d="M55 100 H78 L90 72 L106 128 L118 100 H145"
        fill="none"
        stroke="#2563EB"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Hero() {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-24">
      <PageContainer size="xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              MedicalPlan-Xray
            </p>

            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
              Predict your ideal medical insurance plan
            </h1>

            <p className="mt-5 max-w-lg text-lg text-gray-600">
              An AI-powered system that analyzes your demographic, financial,
              and lifestyle profile to instantly recommend the medical
              insurance plan that fits you best.
            </p>

            <div className="mt-8">
              <Button as={Link} to="/predict" size="lg">
                Predict My Plan
              </Button>
            </div>
          </div>

          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-primary-50 via-white to-accent-50 p-10 shadow-card sm:p-14">
            <Badge variant="primary" className="absolute left-6 top-6">
              AI Model
            </Badge>
            <Badge variant="accent" className="absolute bottom-6 right-6">
              Explainable results
            </Badge>
            <HeroIllustration />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export default Hero
