import Label from './Label.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import HelperText from './HelperText.jsx'

/**
 * Internal composition helper — NOT a page-facing component.
 *
 * Input, NumberInput, and Select all need the same
 * Label -> control -> ErrorMessage/HelperText structure. Rather than
 * duplicating that markup in each one, they render their control
 * (an <input> or <select>) as `children` of this shell.
 */
function FieldShell({ id, label, required, error, helperText, className = '', children }) {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {children}
      <ErrorMessage>{error}</ErrorMessage>
      {!error && <HelperText>{helperText}</HelperText>}
    </div>
  )
}

export default FieldShell