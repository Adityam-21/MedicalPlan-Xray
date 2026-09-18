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
        "flex h-12 items-center justify-center rounded-lg px-6 text-sm font-semibold",
        "bg-gradient-to-r from-slate-900 to-slate-700 text-white",
        "dark:from-indigo-600 dark:to-indigo-500",
        "transition-colors duration-200",
        "hover:from-slate-800 hover:to-slate-600",
        "dark:hover:from-indigo-500 dark:hover:to-indigo-400",
        "disabled:cursor-not-allowed disabled:opacity-60",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-3">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Scoring…
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
