import { cn } from '../../utils/cn.js'
import FieldShell from './FieldShell.jsx'

/**
 * <RadioGroup
 *   label="Smoker"
 *   name="is_smoker"
 *   options={[{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }]}
 *   value={value}
 *   onChange={(e) => setValue(Number(e.target.value))}
 * />
 *
 * Renders as a set of segmented, pill-style options rather than bare
 * native radios — reads better in a dense form. `option.value` can be
 * a string or number; comparison uses strict equality against `value`.
 */
function RadioGroup({
  id,
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  helperText,
  required = false,
  className = '',
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
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const optionId = `${name}-${option.value}`
          const isChecked = value === option.value

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors',
                isChecked
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={onChange}
                required={required}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </FieldShell>
  )
}

export default RadioGroup