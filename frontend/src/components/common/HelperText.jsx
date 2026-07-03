function HelperText({ children }) {
  if (!children) return null

  return (
    <p className="mt-1 text-sm text-gray-500">
      {children}
    </p>
  )
}

export default HelperText