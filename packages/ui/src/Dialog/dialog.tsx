import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import Button from '../Button'
import FadeAndMove from '../FadeAndMove'
import Portal from '../Portal'
import Text from '../Text'
import { clsx } from '../utils'

export type DialogProps = Readonly<{
  id: string
  title: string
  show?: boolean
  className?: string
  children?: React.ReactNode
  buttons?: React.ReactNode[]
  onClose: (reason: 'button' | 'escape' | 'backdrop') => void
  onCloseStart?: () => void
  onCloseEnd?: () => void
  portal?: boolean | HTMLElement
  closeLabel?: string
  size?: 'extra-large' | 'large' | 'medium' | 'small'
  slots?: {
    container?: React.ElementType
  }
  slotProps?: {
    container?: React.ComponentProps<'div'>
  }
  unmountWhenHidden?: boolean
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
  slotProps = {},
  slots = {},
  title,
  unmountWhenHidden = false,
}: DialogProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  const onCloseImpl: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault()
      onClose('button')
    },
    [onClose],
  )

  const finalButtons = useMemo(
    () => [
      <Button
        type="button"
        color="neutral"
        variant="text"
        onClick={onCloseImpl}
        key="close"
      >
        {closeLabel || 'Close'}
      </Button>,
      ...(buttons || []),
    ],
    [buttons, onCloseImpl, closeLabel],
  )

  const onBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose('backdrop')
      }
    },
    [onClose],
  )

  useLayoutEffect(() => {
    const abort = new AbortController()
    if (element) {
      window.addEventListener(
        'keyup',
        (ev) => {
          if (ev.key === 'Escape') {
            onClose('escape')
          }
        },
        { signal: abort.signal, passive: true },
      )
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

  const ContainerElement = slots.container ?? 'div'
  return (
    <Portal portal={portal}>
      <FadeAndMove
        className={clsx(
          'fixed w-dvw h-dvh visible z-40 top-0 left-0',
          'flex justify-center items-center p-6',
          'bg-text-contrasted/20 backdrop-blur-xl duration-250',
          'aria-hidden:scale-[99%]',
          className,
        )}
        id={`dialog-${id}`}
        show={show}
        role="presentation"
        ref={setElement}
        onClick={onBackdropClick}
        onHide={onCloseStart}
        onHidden={onCloseEnd}
        unmountWhenHidden={unmountWhenHidden}
        data-testid="dialog:backdrop"
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
          <ContainerElement
            {...slotProps.container}
            className="flex min-h-0 min-w-0 grow flex-col"
          >
            <div className="mb-4 px-5 pt-4 select-none">
              <Text
                size="h4"
                id={`dialog-${id}-title`}
              >
                {title}
              </Text>
            </div>
            <div className="shrink overflow-y-auto px-5">{children}</div>
            <div className="mx-3 mt-5 mb-3 flex h-8 justify-end gap-2">{finalButtons}</div>
          </ContainerElement>
        </div>
      </FadeAndMove>
    </Portal>
  )
}
