import PageContainer from '../layout/PageContainer.jsx'
import Card from '../common/Card.jsx'

const FEATURES = [
  {
    title: 'ML-powered prediction',
    description:
      'A machine learning model trained on real demographic, financial, and lifestyle data — not a fixed set of rules.',
    icon: (
      <>
        <rect x="4" y="12" width="3.5" height="8" rx="1" />
        <rect x="10.25" y="7" width="3.5" height="13" rx="1" />
        <rect x="16.5" y="4" width="3.5" height="16" rx="1" />
      </>
    ),
  },
  {
    title: 'Fast recommendations',
    description:
      'Submit your details once and get a plan recommendation with a full confidence breakdown in seconds.',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path strokeLinecap="round" d="M12 8v4l3 2" />
      </>
    ),
  },
  {
    title: 'Explainable decision support',
    description:
      'Every recommendation shows the probability behind Low, Medium, and High plans — no black-box guessing.',
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3.5l6.5 2.5v5c0 4.2-2.7 7.6-6.5 9-3.8-1.4-6.5-4.8-6.5-9v-5L12 3.5z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.25 12l1.9 1.9 3.6-3.8" />
      </>
    ),
  },
]

/**
 * Three-up feature grid built on the reusable Card's `feature` variant —
 * no dedicated FeatureCard component, per the established Card architecture.
 */
function FeatureHighlights() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <PageContainer size="xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-gray-900">
            Built for clarity, not guesswork
          </h2>
          <p className="mt-3 text-gray-500">
            Everything about your recommendation is visible — how it was
            reached, and how confident the model is.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} variant="feature" padding="lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </PageContainer>
    </div>
  )
}

export default FeatureHighlights
