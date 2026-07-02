import { cn } from '../../utils/cn.js'
import FieldShell from './FieldShell.jsx'

/**
 * <Select
 *   label="Occupation class"
 *   name="occupation_class"
 *   placeholder="Select an option"
 *   options={[
 *     { value: 'Low-Risk', label: 'Low-Risk' },
 *     { value: 'Medium-Risk', label: 'Medium-Risk' },
 *     { value: 'High-Risk', label: 'High-Risk' },
 *   ]}
 *   value={...}
 *   onChange={...}
 * />
 *
 * `options` values are rendered exactly as given — pass the literal
 * backend enum strings (e.g. "Tier-1", "High-Risk") so submitted
 * values match schemas.py without any client-side remapping.
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
          'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900',
          'transition-colors duration-150',
          'focus:outline-none focus:border-primary-500 focus:shadow-focus',
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
          error
            ? 'border-danger-400 focus:border-danger-500 focus:shadow-none focus:ring-2 focus:ring-danger-100'
            : 'border-gray-300',
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