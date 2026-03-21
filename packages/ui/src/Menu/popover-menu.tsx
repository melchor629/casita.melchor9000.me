import { flip, type VirtualElement } from '@floating-ui/react'
import { useCallback, useLayoutEffect, useState, type SyntheticEvent } from 'react'
import FadeAndMove from '../FadeAndMove'
import Popover, { type PopoverProps } from '../Popover'
import Menu, { type MenuProps } from './menu'

export type PopoverMenuProps = Readonly<
  & MenuProps
  & Pick<PopoverProps, 'onClose' | 'placement' | 'strategy' | 'middleware' | 'portal'>
  & {
    open?: boolean
    referenceElement: PopoverProps['referenceElement'] | 'contextMenu'
  }
>

const ignore = (e: SyntheticEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

export default function PopoverMenu({
  middleware,
  onClose,
  open,
  placement,
  portal,
  referenceElement,
  strategy,
  ...props
}: PopoverMenuProps) {
  const [pos, setPos] = useState<VirtualElement | null>(null)

  const onPopoverClose = useCallback<NonNullable<typeof onClose>>((reason) => {
    if (referenceElement === 'contextMenu') {
      setPos(null)
    }
    onClose?.(reason)
  }, [referenceElement, onClose])

  useLayoutEffect(() => {
    if (referenceElement !== 'contextMenu') {
      return () => {}
    }

    const fn = (event: PointerEvent) => {
      event.stopPropagation()
      event.preventDefault()
      setPos({
        getBoundingClientRect() {
          return {
            x: event.clientX,
            y: event.clientY,
            height: 1,
            width: 1,

            top: event.clientY,
            left: event.clientX,
            bottom: null!,
            right: null!,
          }
        },
      })
    }
    document.body.addEventListener('contextmenu', fn, false)
    return () => document.body.addEventListener('contextmenu', fn, false)
  }, [referenceElement])

  return (
    <Popover
      referenceElement={referenceElement === 'contextMenu' ? pos : referenceElement}
      onClose={onPopoverClose}
      placement={placement ?? 'bottom-start'}
      strategy={strategy}
      middleware={referenceElement === 'contextMenu' ? [flip()] : middleware}
      portal={portal}
      onContextMenu={ignore}
    >
      <FadeAndMove show={referenceElement === 'contextMenu' ? pos != null : open} unmountWhenHidden>
        <Menu {...props} />
      </FadeAndMove>
    </Popover>
  )
}
