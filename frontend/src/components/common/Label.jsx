function Label({ htmlFor, required = false, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      {children}
      {required && (
        <span className="ml-1 text-red-500">*</span>
      )}
    </label>
  )
}

export default Label