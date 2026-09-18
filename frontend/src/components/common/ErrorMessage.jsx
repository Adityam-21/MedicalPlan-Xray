function ErrorMessage({ children }) {
  if (!children) return null

  return (
    <p role="alert" className="mt-1 text-xs font-medium text-danger-600 dark:text-danger-400">
      {children}
    </p>
  )
}

export default ErrorMessage
