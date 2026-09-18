import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import PageContainer from "./PageContainer.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { cn } from "../../utils/cn.js";

const NAV_LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/predict", label: "Score a profile" },
    { to: "/about", label: "How it works" },
];

const desktopLink = ({ isActive }) =>
    cn(
        "relative py-5 text-sm font-medium transition-colors",
        "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors",
        isActive
            ? "text-slate-900 dark:text-slate-100 after:bg-indigo-700"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 after:bg-transparent"
    );

const mobileLink = ({ isActive }) =>
    cn(
        "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
        isActive ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
    );

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => setIsMenuOpen(false), [location.pathname]);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
            <PageContainer size="xl">
                <nav className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="py-4 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
                    >
                        MedicalPlan<span className="text-indigo-700 dark:text-indigo-300">-Xray</span>
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        {NAV_LINKS.map((link) => (
                            <NavLink key={link.to} to={link.to} end={link.end} className={desktopLink}>
                                {link.label}
                            </NavLink>
                        ))}
                        <ThemeToggle />
                        {location.pathname !== "/predict" && (
                            <Link
                                to="/predict"
                                className="rounded-lg bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:hover:bg-indigo-500"
                            >
                                Try it
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                        className="-mr-2 rounded-lg p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                            ) : (
                                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                            )}
                        </svg>
                    </button>
                    </div>
                </nav>

                {isMenuOpen && (
                    <div className="space-y-1 border-t border-slate-100 dark:border-slate-800 py-3 md:hidden">
                        {NAV_LINKS.map((link) => (
                            <NavLink key={link.to} to={link.to} end={link.end} className={mobileLink}>
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </PageContainer>
        </header>
    );
}

export default Navbar;
