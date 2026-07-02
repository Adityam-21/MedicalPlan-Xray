import { cn } from '../../utils/cn.js'
import Spinner from './Spinner.jsx'

const VARIANTS = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-soft',
  secondary:
    'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-soft',
  outline:
    'bg-white text-primary-700 border border-primary-200 hover:bg-primary-50 active:bg-primary-100',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
}

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

/**
 * Single reusable button covering every visual state via props:
 *   <Button variant="primary" />
 *   <Button variant="secondary" />
 *   <Button variant="outline" />
 *   <Button variant="ghost" />
 *   <Button variant="primary" isLoading />
 *   <Button variant="primary" disabled />
 *
 * Deliberately not split into PrimaryButton/SecondaryButton/etc. — the
 * markup and behavior are identical, only the styling varies.
 *
 * Polymorphic via `as` so a CTA can render as a router Link/anchor while
 * keeping identical styling, e.g. <Button as={Link} to="/predict" />.
 * Defaults to a native <button>.
 */
function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  leftIcon = null,
  rightIcon = null,
  className = '',
  children,
  ...rest
}) {
  const isDisabled = disabled || isLoading
  // Native-button-only attributes — irrelevant/invalid on Link/anchor.
  const buttonOnlyProps = Component === 'button' ? { type, disabled: isDisabled } : {}

  return (
    <Component
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors duration-150 focus:outline-none focus-visible:shadow-focus',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...buttonOnlyProps}
      {...rest}
    >
      {isLoading ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} label="Loading" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </Component>
  )
}

export default Button