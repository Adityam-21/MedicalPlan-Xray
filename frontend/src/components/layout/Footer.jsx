import { Link } from 'react-router-dom'
import PageContainer from './PageContainer.jsx'

// Placeholder hrefs — swap in the real profile URLs when available.
const SOCIAL_LINKS = [
    {
        label: 'GitHub',
        href: '#',
        icon: (
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.02 11.02 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.51 10.51 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
        ),
    },
    {
        label: 'LinkedIn',
        href: '#',
        icon: (
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
        ),
    },
]

/**
 * Minimal, professional site footer: brand + one-line description on one
 * side, social placeholders on the other, copyright below. No page-specific
 * content — safe to render on every route via Layout.
 */
function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-gray-200 bg-white">
            <PageContainer size="xl" className="py-10">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        <Link to="/" className="font-display text-lg font-semibold text-gray-900">
                            MedicalPlan<span className="text-primary-600">-Xray</span>
                        </Link>
                        <p className="mt-1.5 text-sm text-gray-500">
                            Machine learning-powered medical insurance plan recommendations.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {SOCIAL_LINKS.map((social) => (
                            <a>
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria - label= {social.label}
                                className = "inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary-700"
                                <svg
                                    className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    {social.icon}
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-6 text-sm text-gray-400">
                    © {year} MedicalPlan-Xray. All rights reserved.
                </div>
            </PageContainer>
        </footer >
    )
}

export default Footer