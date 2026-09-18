function HelperText({ children }) {
  if (!children) return null

  return (
    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
      {children}
    </p>
  )
}

export default HelperText
