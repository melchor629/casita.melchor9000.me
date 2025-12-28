import { autoUpdate, offset, useFloating, type Placement, type VirtualElement } from '@floating-ui/react'
import {
  type FC, type ReactElement, useCallback, useLayoutEffect, useMemo, useRef, useState,
} from 'react'
import { createPortal } from 'react-dom'
import ContextMenuContainer from './context-menu-container'

export interface ContextMenuItem {
  key: string
  content: ReactElement
  action?(key: string, event: MouseEvent): void
}

interface ContextMenuProps {
  readonly items: ContextMenuItem[]
  readonly portal?: boolean
  readonly referenceElement: Element | VirtualElement | null
  readonly placement?: Placement
  readonly show?: boolean
  readonly shouldClose?: () => void
}

type StateRef = {
  referenceElement: ContextMenuProps['referenceElement']
  show?: boolean
  shouldClose: ContextMenuProps['shouldClose']
}

const ignoreEvent = (e: { preventDefault(): void, stopPropagation(): void }) => {
  e.preventDefault()
  e.stopPropagation()
}

const ContextMenu: FC<ContextMenuProps> = ({
  items, placement = 'bottom', portal = true, referenceElement, shouldClose, show = false,
}) => {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
  const { floatingStyles, refs } = useFloating({
    middleware: [
      offset(8),
    ],
    placement: placement || 'bottom',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  })
  const visibility = useMemo(() => ((show ?? true) ? 'visible' : 'hidden'), [show])
  const stateRef = useRef(null! as StateRef)

  const setContainerElementRef = useCallback((element: HTMLDivElement | null) => {
    setContainerElement(element)
    refs.setFloating(element)
  }, [refs])

  // eslint-disable-next-line react-hooks/refs
  stateRef.current = { referenceElement, show, shouldClose }
  useLayoutEffect(() => {
    if (!containerElement) {
      return () => {}
    }

    const handler = (e: MouseEvent) => {
      if (!stateRef.current.show) {
        return
      }

      const path: Array<EventTarget | VirtualElement> = 'composedPath' in e
        ? e.composedPath()
        : (e as { path: Element[] }).path
      if (stateRef.current.referenceElement && path.includes(stateRef.current.referenceElement)) {
        return
      }

      if (!path.includes(containerElement)) {
        stateRef.current.shouldClose?.()
        return
      }

      const button = path
        .filter((element): element is HTMLButtonElement => element instanceof HTMLButtonElement)
        .at(-1)

      if (button && !button.disabled) {
        stateRef.current.shouldClose?.()
      }
    }

    const escape = (e: KeyboardEvent) => {
      if (stateRef.current.show && e.key === 'Escape') {
        stateRef.current.shouldClose?.()
      }
    }

    document.body.addEventListener('click', handler, true)
    window.addEventListener('keydown', escape, true)
    return () => {
      document.body.removeEventListener('click', handler, true)
      window.removeEventListener('keydown', escape, true)
    }
  }, [containerElement, stateRef])

  useLayoutEffect(() => {
    refs.setReference(referenceElement)
  }, [refs, referenceElement])

  const content = (
    <div
      ref={setContainerElementRef}
      className="z-20"
      style={{ ...floatingStyles, visibility }}
      onContextMenuCapture={ignoreEvent}
    >
      <ContextMenuContainer data-show={show ?? true} role="list">
        {items.map((item) => <div key={item.key} role="listitem">{item.content}</div>)}
      </ContextMenuContainer>
    </div>
  )

  if (portal ?? true) {
    return createPortal(content, document.body)
  }

  return content
}

export default ContextMenu
