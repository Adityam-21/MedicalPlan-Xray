import { cn } from '../../utils/cn.js'

const MAX_WIDTHS = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
}

/**
 * Horizontally centers and pads page content at a consistent max-width.
 * Every page's top-level content should be wrapped in this rather than
 * repeating `mx-auto max-w-* px-4 sm:px-6 lg:px-8` inline.
 */
function PageContainer({ size = 'lg', className = '', children }) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', MAX_WIDTHS[size], className)}>
      {children}
    </div>
  )
}

export default PageContainer