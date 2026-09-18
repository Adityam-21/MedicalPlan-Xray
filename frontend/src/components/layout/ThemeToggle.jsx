import { useEffect, useState } from "react";

const STORAGE_KEY = "mpx-theme";

function apply(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
}

/** Reads the theme chosen in index.html's inline script, then keeps it in sync. */
function currentTheme() {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function ThemeToggle({ className = "" }) {
    const [theme, setTheme] = useState(currentTheme);

    useEffect(() => {
        apply(theme);
        try {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Private mode or blocked storage: the choice just won't persist.
        }
    }, [theme]);

    const next = theme === "dark" ? "light" : "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(next)}
            aria-label={`Switch to ${next} theme`}
            title={`Switch to ${next} theme`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-100 ${className}`}
        >
            {theme === "dark" ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path strokeLinecap="round" d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
                </svg>
            ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
                </svg>
            )}
        </button>
    );
}

export default ThemeToggle;
