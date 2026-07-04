import { cn } from "../../utils/cn.js";

const VARIANTS = {
    default:
        "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",

    glass:
        "bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",

    feature:
        "bg-white border border-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
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