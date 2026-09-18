import { Link } from "react-router-dom";

import PageContainer from "./PageContainer.jsx";

const PROFILE_LINKS = [
    {
        label: "GitHub",
        href: "https://github.com/Adityam-21",
        icon: (
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.02 11.02 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.51 10.51 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
        ),
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/kumar-adityam/",
        icon: (
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
        ),
    },
];

const SITE_LINKS = [
    { to: "/", label: "Home" },
    { to: "/predict", label: "Score a profile" },
    { to: "/about", label: "How it works" },
];

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <PageContainer size="xl" className="py-10">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-md">
                        <Link to="/" className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            MedicalPlan<span className="text-indigo-700 dark:text-indigo-300">-Xray</span>
                        </Link>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            An interpretable plan-tier model with the reasoning shown alongside every result.
                            Educational demo on synthetic data — not insurance, financial or medical advice.
                        </p>
                    </div>

                    <div className="flex gap-12">
                        <nav aria-label="Site">
                            <p className="eyebrow">Pages</p>
                            <ul className="mt-3 space-y-2">
                                {SITE_LINKS.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className="text-sm text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-slate-100"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div>
                            <p className="eyebrow">Built by</p>
                            <ul className="mt-3 space-y-2">
                                {PROFILE_LINKS.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-slate-100"
                                        >
                                            <svg
                                                className="h-4 w-4 text-slate-400 dark:text-slate-500 transition group-hover:text-slate-900 dark:group-hover:text-slate-100"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                {link.icon}
                                            </svg>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <p className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 text-xs text-slate-400 dark:text-slate-500">
                    © {year} Kumar Adityam · MedicalPlan-Xray
                </p>
            </PageContainer>
        </footer>
    );
}

export default Footer;
