import { cn } from '../../utils/cn.js'
import FieldShell from './FieldShell.jsx'

/**
 * <Input label="Full name" name="fullName" value={...} onChange={...} />
 *
 * Any native <input> prop (placeholder, autoComplete, min, max, step, etc.)
 * passes straight through via ...rest.
 */
function Input({
  id,
  label,
  error,
  helperText,
  required = false,
  type = 'text',
  className = '',
  inputClassName = '',
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
      <input
        id={id}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        className={cn(
          'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900',
          'placeholder:text-gray-400 transition-colors duration-150',
          'focus:outline-none focus:border-primary-500 focus:shadow-focus',
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
          error
            ? 'border-danger-400 focus:border-danger-500 focus:shadow-none focus:ring-2 focus:ring-danger-100'
            : 'border-gray-300',
          inputClassName,
        )}
        {...rest}
      />
    </FieldShell>
  )
}

export default Input