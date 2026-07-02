/**
 * Joins conditional class names into a single string, skipping falsy values.
 * A minimal, dependency-free stand-in for libraries like clsx — kept in
 * utils rather than adding an extra package for something this small.
 *
 * @example cn('px-4', isActive && 'bg-primary-600', error && 'border-danger-500')
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}