import { cn } from '../../utils/cn.js'

const VARIANTS = {
  success: {
    wrapper: 'bg-success-50 border-success-200 text-success-700',
    icon: 'text-success-600',
  },
  error: {
    wrapper: 'bg-danger-50 border-danger-200 text-danger-700',
    icon: 'text-danger-600',
  },
  info: {
    wrapper: 'bg-primary-50 border-primary-200 text-primary-700',
    icon: 'text-primary-600',
  },
}

const ICON_PATHS = {
  success: 'M9 12.75l2.25 2.25 4.5-4.5m4.5 2.25a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M12 9v3.75m0 3h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
}

/**
 * <Alert variant="success" title="Prediction saved">...</Alert>
 * <Alert variant="error">Something went wrong. Please try again.</Alert>
 */
function Alert({ variant = 'info', title, className = '', children }) {
  const styles = VARIANTS[variant]

  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-xl border px-4 py-3.5 text-sm', styles.wrapper, className)}
    >
      <svg
        className={cn('mt-0.5 h-5 w-5 flex-shrink-0', styles.icon)}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[variant]} />
      </svg>
      <div>
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && 'mt-0.5')}>{children}</div>}
      </div>
    </div>
  )
}

export default Alert