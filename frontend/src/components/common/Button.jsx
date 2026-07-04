import { cn } from "../../utils/cn.js";

function Button({
  type = "button",
  children,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "flex h-12 items-center justify-center rounded-xl",
        "bg-gradient-to-r from-blue-600 to-indigo-600",
        "px-6 font-semibold text-white",
        "shadow-md",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5",
        "hover:scale-[1.015]",
        "hover:from-blue-700 hover:to-indigo-700",
        "hover:shadow-xl",
        "active:scale-[0.98]",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
        "disabled:hover:translate-y-0",
        "disabled:hover:scale-100",
        "disabled:hover:shadow-md",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"></div>
          <span>Generating Recommendation...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;