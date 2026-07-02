import { cn } from '../../utils/cn.js'

const VARIANTS = {
  neutral: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-50 text-primary-700',
  accent: 'bg-accent-50 text-accent-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
}

/**
 * <Badge variant="success">Low</Badge>
 *
 * Small status/label pill. `success`/`warning`/`danger` variants are
 * reserved for prediction-plan semantics (Low/Medium/High) and other
 * genuine status meaning — not decorative use elsewhere.
 */
function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge