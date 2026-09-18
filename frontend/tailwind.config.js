/** @type {import('tailwindcss').Config} */
export default {
  // Class strategy: index.html sets `dark` on <html> before paint, so there
  // is no flash, and the ThemeToggle flips it at runtime.
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Inter for text, IBM Plex Mono for figures, so numbers read like a report.
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // Referenced across the app (text-primary-600, border-danger-400) but
        // previously undefined, so those classes produced no styling.
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        danger: {
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
      },
      boxShadow: {
        focus: "0 0 0 3px rgb(99 102 241 / 0.25)",
        panel: "0 1px 2px 0 rgb(15 23 42 / 0.04)",
      },
      letterSpacing: {
        label: "0.09em",
      },
    },
  },
  plugins: [],
}
