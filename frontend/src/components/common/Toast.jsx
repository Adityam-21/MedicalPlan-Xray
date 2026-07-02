import { cn } from '../../utils/cn.js'

const VARIANTS = {
  success: 'bg-success-600',
  error: 'bg-danger-600',
  info: 'bg-primary-600',
}

/**
 * <Toast variant="success" message="Prediction saved" onClose={() => ...} />
 *
 * Purely presentational — renders a single toast. Pair with the
 * useToast hook, which owns the list of active toasts:
 *
 *   const { toasts, dismissToast } = useToast()
 *   toasts.map((t) => (
 *     <Toast key={t.id} variant={t.variant} message={t.message}
 *            onClose={() => dismissToast(t.id)} />
 *   ))
 */
function Toast({ variant = 'info', message, onClose, className = '' }) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-card',
        VARIANTS[variant],
        className,
      )}
    >
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="rounded-md p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Toast