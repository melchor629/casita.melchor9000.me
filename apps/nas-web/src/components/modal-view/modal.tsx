import { Modal as BsModal } from 'bootstrap'
import {
  useCallback, useLayoutEffect, useMemo, useRef, useState,
} from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  readonly id: string
  readonly title: string
  readonly show?: boolean
  readonly className?: string
  readonly centered?: boolean
  readonly children?: React.ReactNode
  readonly buttons?: React.ReactNode[]
  readonly onClose?: () => void
  readonly onClosing?: () => void
  readonly closeLabel?: string
  readonly size?: 'xl' | 'lg' | 'sm'
}

function LeModal({
  buttons,
  centered,
  children,
  className,
  closeLabel,
  id,
  onClose,
  onClosing,
  show,
  size,
  title,
}: ModalProps) {
  const modalRef = useRef<BsModal>(null)
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [lastShow, setLastShow] = useState<boolean>(false)

  useLayoutEffect(() => {
    if (element) {
      const modal = new BsModal(element)
      if (show) {
        modal.show()
      }
      modalRef.current = modal
      return () => modal.dispose()
    }

    return undefined
  }, [element]) // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (element) {
      const cbk = () => onClose?.()
      element.addEventListener('hidden.bs.modal', cbk)
      return () => {
        element.removeEventListener('hidden.bs.modal', cbk)
      }
    }

    return undefined
  }, [onClose, element])

  useLayoutEffect(() => {
    if (element) {
      const cbk = () => onClosing?.()
      element.addEventListener('hide.bs.modal', cbk)
      return () => {
        element.removeEventListener('hide.bs.modal', cbk)
      }
    }

    return undefined
  }, [onClosing, element])

  useLayoutEffect(() => {
    if (!lastShow && show) {
      modalRef.current?.show()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastShow(true)
    } else if (lastShow && !show) {
      modalRef.current?.hide()
      setLastShow(false)
    }
  }, [show, lastShow])

  const onCloseImpl: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault()
    onClose?.()
  }, [onClose])

  const finalButtons = useMemo(() => [
    <button type="button" className="btn btn-secondary" onClick={onCloseImpl} key="close">
      {closeLabel || 'Close'}
    </button>,
    ...(buttons || []),
  ], [buttons, onCloseImpl, closeLabel])

  const modalDialogClasses = useMemo(() => (
    [
      'modal-dialog',
      size && `modal-${size}`,
      (centered ?? true) && 'modal-dialog-centered',
    ].filter((f) => !!f).join(' ')
  ), [size, centered])

  return (
    <div
      className={`modal fade ${className ?? ''}`}
      id={`modal-${id}`}
      tabIndex={-1}
      role="dialog"
      aria-labelledby={`modal-${id}-title`}
      aria-hidden={!show ? 'true' : 'false'}
      ref={setElement}
    >
      <div role="presentation" onClick={(e) => e.stopPropagation()}>
        <div className={modalDialogClasses} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`modal-${id}-title`}>{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onCloseImpl} />
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">{finalButtons}</div>
          </div>
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
