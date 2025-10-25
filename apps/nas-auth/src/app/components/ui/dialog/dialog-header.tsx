import type { MouseEvent } from 'preact/compat'
import { useCallback, useEffect } from 'preact/hooks'
import type { BaseHtmlProps } from '../types'

type DialogHeaderProps = BaseHtmlProps<'header', {
  onClose?: () => void
}>

const DialogHeader = ({ children, onClose, ...props }: DialogHeaderProps) => {
  const onCloseButtonClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onClose?.()
  }, [onClose])

  useEffect(() => {
    const ctrl = new AbortController()
    window.addEventListener('keyup', (e) => {
      if (e.key.toLowerCase() === 'escape') {
        onClose?.()
      }
    }, { signal: ctrl.signal })
    return () => ctrl.abort()
  }, [onClose])

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <header className="flex justify-between items-start mb-4 md:md-6 select-none" {...props}>
      <span className="text-xl md:text-2xl lg:text-3xl">{children}</span>
      <button
        type="button"
        className="text-xl md:text-2xl hover:opacity-80 active:opacity-60 cursor-pointer transition-opacity"
        onClick={onCloseButtonClick}
      >
        &times;
      </button>
    </header>
  )
}

export default DialogHeader
