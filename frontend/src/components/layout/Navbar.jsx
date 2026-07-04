import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import PageContainer from "./PageContainer.jsx";
import { cn } from "../../utils/cn.js";

const NAV_LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/predict", label: "Predict" },
    { to: "/about", label: "About" },
];

const navLinkClass = ({ isActive }) =>
    cn(
        "group relative px-1 py-2 text-[15px] font-medium transition-all duration-300",
        isActive
            ? "font-semibold text-primary-600"
            : "text-gray-600 hover:text-primary-600 hover:scale-105"
    );

const mobileNavLinkClass = ({ isActive }) =>
    cn(
        "block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200",
        isActive
            ? "bg-primary-50 text-primary-700"
            : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
    );

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const showCTA = location.pathname !== "/predict";

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl shadow-sm">
            <PageContainer size="xl">
                <nav className="flex h-[72px] items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-3xl font-black tracking-tight text-gray-900 transition-all duration-300 hover:scale-[1.02]"
                    >
                        MedicalPlan
                        <span className="text-primary-600">-Xray</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-10 md:flex">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={navLinkClass}
                            >
                                {({ isActive }) => (
                                    <div className="relative flex flex-col items-center">
                                        <span>{link.label}</span>

                                        <span
                                            className={cn(
                                                "absolute -bottom-3 h-[3px] rounded-full bg-primary-600 transition-all duration-300",
                                                isActive
                                                    ? "w-full opacity-100"
                                                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                                            )}
                                        />
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Mobile Menu */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition-all duration-200 hover:bg-gray-100 md:hidden"
                    >
                        ☰
                    </button>

                </nav>
            </PageContainer>

            {isMenuOpen && (
                <div className="border-t bg-white md:hidden">
                    <PageContainer size="xl" className="space-y-2 py-4">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={mobileNavLinkClass}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {showCTA && (
                            <Link
                                to="/predict"
                                onClick={() => setIsMenuOpen(false)}
                                className="mt-2 block rounded-xl bg-primary-600 px-4 py-3 text-center font-semibold text-white transition-all duration-300 hover:bg-primary-700"
                            >
                                Get Recommendation
                            </Link>
                        )}
                    </PageContainer>
                </div>
            )}
        </header>
    );
}

export default Navbar;