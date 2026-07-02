import { cn } from '../../utils/cn.js'

const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-[3px]',
}

/**
 * Circular loading spinner. Uses `currentColor` for its stroke so it
 * automatically matches the text color of whatever it's placed in
 * (e.g. white inside a primary Button, primary-600 on a white page).
 */
function Spinner({ size = 'md', className = '', label = 'Loading' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        SIZES[size],
        className,
      )}
    />
  )
}

export default Spinner