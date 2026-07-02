import { useCallback, useState } from 'react'

let idCounter = 0

/**
 * Manages a list of active toast notifications. Pure state — rendering
 * is left to the consumer via the Toast component:
 *
 *   const { toasts, showToast, dismissToast } = useToast()
 *   showToast({ variant: 'success', message: 'Prediction saved' })
 *
 *   {toasts.map((t) => (
 *     <Toast key={t.id} variant={t.variant} message={t.message}
 *            onClose={() => dismissToast(t.id)} />
 *   ))}
 *
 * @param {number} autoDismissMs - ms before a toast auto-dismisses. Pass 0 to disable.
 */
export default function useToast(autoDismissMs = 4000) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ variant = 'info', message }) => {
      const id = ++idCounter
      setToasts((current) => [...current, { id, variant, message }])

      if (autoDismissMs > 0) {
        setTimeout(() => dismissToast(id), autoDismissMs)
      }

      return id
    },
    [autoDismissMs, dismissToast],
  )

  return { toasts, showToast, dismissToast }
}