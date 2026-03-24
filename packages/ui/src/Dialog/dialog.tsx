import React, {
  useCallback, useLayoutEffect, useMemo, useState,
} from 'react'
import Button from '../Button'
import Portal from '../Portal'
import { clsx } from '../utils'

export type DialogProps = Readonly<{
  id: string
  title: string
  show?: boolean
  className?: string
  children?: React.ReactNode
  buttons?: React.ReactNode[]
  onClose: () => void
  onCloseStart?: () => void
  onCloseEnd?: () => void
  portal?: boolean | HTMLElement
  closeLabel?: string
  size?: 'extra-large' | 'large' | 'medium' | 'small'
}>

export default function Dialog({
  buttons,
  children,
  className,
  closeLabel,
  id,
  onClose,
  onCloseEnd,
  onCloseStart,
  portal,
  show,
  size = 'medium',
  title,
}: DialogProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  const onCloseImpl: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault()
    onClose?.()
  }, [onClose])

  const finalButtons = useMemo(() => [
    <Button type="button" color="secondary" variant="text" onClick={onCloseImpl} key="close">
      {closeLabel || 'Close'}
    </Button>,
    ...(buttons || []),
  ], [buttons, onCloseImpl, closeLabel])

  useLayoutEffect(() => {
    const abort = new AbortController()
    if (element) {
      window.addEventListener('keyup', (ev) => {
        if (ev.key === 'Escape') {
          onClose()
        }
      }, { signal: abort.signal, passive: true })
    }

    return () => abort.abort()
  }, [element, onClose])

  useLayoutEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [show])

  return (
    <Portal portal={portal}>
      <div
        className={clsx(
          'fixed w-dvw h-dvh visible z-40 top-0 left-0',
          'flex justify-center items-center p-4',
          'translate-y-0 opacity-100 bg-text-contrasted/20 backdrop-blur-xl transition-all duration-250',
          'aria-hidden:invisible aria-hidden:opacity-0 aria-hidden:translate-y-4',
          className,
        )}
        id={`dialog-${id}`}
        role="presentation"
        aria-hidden={!show ? 'true' : 'false'}
        ref={setElement}
        onClick={useCallback((e: React.MouseEvent) => e.target === e.currentTarget && onClose(), [onClose])}
        onTransitionStart={useCallback((e: React.SyntheticEvent) => {
          if (e.currentTarget === e.target && !show) {
            onCloseStart?.()
          }
        }, [show, onCloseStart])}
        onTransitionEnd={useCallback((e: React.SyntheticEvent) => {
          if (e.currentTarget === e.target && !show) {
            onCloseEnd?.()
          }
        }, [show, onCloseEnd])}
      >
        <div
          className={clsx(
            'rounded-lg bg-elevated-1 border border-elevated-border shadow-xl max-h-full flex',
            size === 'small' && 'w-full sm:w-sm',
            size === 'medium' && 'w-full sm:w-md',
            size === 'large' && 'w-full sm:w-lg',
            size === 'extra-large' && 'w-full md:w-xl',
          )}
          role="dialog"
          aria-labelledby={`dialog-${id}-title`}
        >
          <div className="flex flex-col grow min-w-0 min-h-0">
            <div className="px-5 pt-4 mb-5 select-none">
              <h4 className="text-h4" id={`dialog-${id}-title`}>{title}</h4>
            </div>
            <div className="px-5 overflow-y-auto shrink">{children}</div>
            <div className="flex justify-end gap-2 h-8 mt-5 mb-3 mx-3">{finalButtons}</div>
          </div>
        </div>
      </div>
    </Portal>
  )
}
