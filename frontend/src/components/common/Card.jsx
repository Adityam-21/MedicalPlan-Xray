import { cn } from "../../utils/cn.js";

const VARIANTS = {
    default:
        "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm transition-colors",

    glass:
        "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-800 shadow-sm transition-colors",

    feature:
        "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors",

    // No hover movement: for long content panels where a lift is distracting.
    plain: "bg-white border border-gray-200 shadow-sm",
};

const PADDING = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

/**
 * Generic reusable Card component.
 */
function Card({
    variant = "default",
    padding = "md",
    className = "",
    children,
    ...rest
}) {
    return (
        <div
            className={cn(
                "rounded-2xl overflow-hidden",
                VARIANTS[variant],
                PADDING[padding],
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
}

export default Card;
