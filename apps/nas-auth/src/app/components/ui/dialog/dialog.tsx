import { AnimatePresence } from 'motion/react'
import { createPortal } from 'preact/compat'
import type { BaseHtmlProps } from '../types'
import DialogBackdrop from './dialog-backdrop'
import DialogContainer from './dialog-container'

type DialogProps = BaseHtmlProps<'div', {
  onClosed?: () => void
  onOpened?: () => void
  open: boolean
  portal?: boolean
  size?: 'sm' | 'md' | 'lg' | `${'' | '1' | '2' | '3' | '4' | '5' | '6'}xl`
  style?: never
}>

const Dialog = ({
  children,
  onClosed,
  onOpened,
  open,
  portal,
  size,
  ...props
}: DialogProps) => {
  const element = (
    <AnimatePresence>
      {open && (
        <DialogBackdrop onClosed={onClosed} onOpened={onOpened}>
          <DialogContainer
            size={size}
            role="dialog"
            {...props}
          >
            {children}
          </DialogContainer>
        </DialogBackdrop>
      )}
    </AnimatePresence>
  )

  if (portal) {
    return typeof window !== 'undefined'
      ? createPortal(element, document.body)
      : null
  }

  return element
}

export default Dialog
