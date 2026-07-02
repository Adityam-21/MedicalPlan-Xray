import { cn } from '../../utils/cn.js'

const VARIANTS = {
  default: 'bg-white border border-gray-200 shadow-card',
  glass: 'bg-white/70 backdrop-blur-md border border-white/60 shadow-card',
  // For highlighting a single feature/benefit (icon + short copy).
  // Same Card shape, just a lighter resting style with a hover lift —
  // no separate FeatureCard component needed.
  feature:
    'bg-white border border-gray-100 shadow-soft transition-shadow duration-200 hover:shadow-card',
}

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

/**
 * <Card>...</Card>
 * <Card variant="glass" padding="lg">...</Card>
 * <Card variant="feature">...</Card>
 *
 * Generic surface container. Page-specific cards (e.g. a prediction
 * result card, a feature highlight) should compose this via `variant`
 * rather than duplicating its styling in a new component.
 */
function Card({ variant = 'default', padding = 'md', className = '', children, ...rest }) {
  return (
    <div
      className={cn('rounded-2xl', VARIANTS[variant], PADDING[padding], className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card