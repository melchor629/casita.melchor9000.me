import React, {
  useCallback, useLayoutEffect, useMemo, useState,
} from 'react'
import { createPortal } from 'react-dom'
import Button from '../core/button'
import { clsx } from '../core/utils'

interface ModalProps {
  readonly id: string
  readonly title: string
  readonly show?: boolean
  readonly className?: string
  readonly children?: React.ReactNode
  readonly buttons?: React.ReactNode[]
  readonly onClose: () => void
  readonly onCloseStart?: () => void
  readonly onCloseEnd?: () => void
  readonly closeLabel?: string
  readonly size?: 'xl' | 'lg' | 'md' | 'sm'
}

function LeModal({
  buttons,
  children,
  className,
  closeLabel,
  id,
  onClose,
  onCloseEnd,
  onCloseStart,
  show,
  size = 'md',
  title,
}: ModalProps) {
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
    <div
      className={clsx(
        'fixed w-dvw h-dvh visible z-40 top-0 left-0',
        'flex justify-center items-center p-4',
        'translate-y-0 opacity-100 bg-text-contrasted/20 backdrop-blur-xl transition-all duration-250',
        'aria-hidden:invisible aria-hidden:opacity-0 aria-hidden:translate-y-4',
        className,
      )}
      id={`modal-${id}`}
      role="presentation"
      aria-labelledby={`modal-${id}-title`}
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
          'rounded-lg bg-elevated-1 shadow-xl max-h-full overflow-auto',
          size === 'sm' && 'w-full sm:w-sm',
          size === 'md' && 'w-full sm:w-md',
          size === 'lg' && 'w-full sm:w-lg',
          size === 'xl' && 'w-full md:w-xl',
        )}
        role="dialog"
      >
        <div className="px-5 py-4">
          <div className="mb-5 select-none">
            <h4 className="text-h4" id={`modal-${id}-title`}>{title}</h4>
          </div>
          <div className="mb-5">{children}</div>
          <div className="flex justify-end gap-2 h-8 -mb-1 -mr-1">{finalButtons}</div>
        </div>
      </div>
    </div>
  )
}

interface RealModalProps extends ModalProps {
  readonly portal?: boolean | Element
}

export default function Modal({ portal, ...props }: RealModalProps) {
  if (portal) {
    return createPortal(
      <LeModal {...props} />,
      typeof portal === 'boolean' ? document.body : portal,
    )
  }

  return <LeModal {...props} />
}
