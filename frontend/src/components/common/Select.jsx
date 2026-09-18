import { cn } from '../../utils/cn.js'
import FieldShell from './FieldShell.jsx'

/**
 * `options` values are rendered exactly as given — pass the literal backend
 * enum strings (e.g. "Tier-1", "High-Risk") so submitted values match
 * schemas.py without any client-side remapping.
 */
function Select({
  id,
  label,
  error,
  helperText,
  required = false,
  placeholder,
  options = [],
  className = '',
  selectClassName = '',
  ...rest
}) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={className}
    >
      <select
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        className={cn(
          'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900',
          'dark:bg-slate-950 dark:text-slate-100',
          'transition-colors duration-150',
          'focus:outline-none focus:border-indigo-500 focus:shadow-focus',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
          'dark:disabled:bg-slate-900 dark:disabled:text-slate-600',
          error
            ? 'border-danger-400 focus:border-danger-500 focus:shadow-none focus:ring-2 focus:ring-danger-100 dark:focus:ring-danger-700/40'
            : 'border-slate-300 dark:border-slate-700',
          selectClassName,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export default Select
