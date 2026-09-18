function Label({ htmlFor, required = false, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {children}
      {required && <span className="ml-1 text-danger-500">*</span>}
    </label>
  )
}

export default Label
