import Input from './Input.jsx'

/**
 * <NumberInput label="Age" name="age" min={18} max={100} value={...} onChange={...} />
 *
 * Thin wrapper over Input (type="number") rather than a parallel
 * implementation — keeps the label/error/helper/focus/error styling in
 * exactly one place. Maps directly onto the numeric fields in the
 * backend's PredictionRequest schema (age, total_income_inr,
 * annual_expenditure_inr, family_members).
 */
function NumberInput(props) {
  return <Input type="number" inputMode="decimal" {...props} />
}

export default NumberInput