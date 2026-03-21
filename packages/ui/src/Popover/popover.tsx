import { autoUpdate, offset, useFloating, type Middleware, type Placement, type Strategy, type VirtualElement } from '@floating-ui/react'
import { useCallback, useEffectEvent, useLayoutEffect, useState, type ComponentPropsWithRef } from 'react'
import Portal, { type PortalProps } from '../Portal'
import { clsx } from '../utils'

export type PopoverProps = Readonly<ComponentPropsWithRef<'div'> & {
  /**
   * A function that tells the popover should be closed and its reason.
   * The callback is called when the user presses escape or clicks outside
   * the popover.
   * @param reason The reason on why it is being closed.
   */
  onClose?: (reason?: 'click' | 'escape') => void
  /**
   * Where to place the popover container, based on the
   * {@link PopoverProps.referenceElement}.
   * @default 'bottom'
   */
  placement?: Placement
  /**
   * The element that serves as reference on where the popover should be
   * placed around. The element can be an HTML element or any virtual
   * element that implements the basic function `getBoundingClientRect`.
   * If set to `null`, the container position will not be updated.
   *
   * See more about [Virtual Elements](https://floating-ui.com/docs/virtual-elements).
   */
  referenceElement: Element | VirtualElement | null
  /**
   * Positioning strategy. Either to use `fixed` or `absolute` in the
   * styles.
   * @default 'absolute'
   */
  strategy?: Strategy
  /**
   * A list of {@link Middleware}s to alter the behaviour of the popover.
   * See more in https://floating-ui.com/docs/middleware.
   * @default [offset(8)]
   */
  middleware?: Middleware[]
  /**
   * Places the container and its children in a different HTML element.
   * See {@link Portal}.
   */
  portal?: PortalProps['portal']
}>

/**
 * Put the `chidren` into a container, and positions that container to be
 * around the {@link PopoverProps.referenceElement}. The container can be
 * placed in diferent positions based on {@link PopoverProps.placement}.
 * The container and its children can be placed in a different HTML element
 * using {@link PopoverProps.portal}, only if it is filled.
 * @param param0 Props
 * @returns Element
 */
export default function Popover({
  children,
  className,
  middleware,
  onClose,
  placement = 'bottom',
  portal,
  referenceElement,
  strategy = 'absolute',
  ...props
}: PopoverProps) {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
  const { floatingStyles, refs } = useFloating({
    middleware: middleware ?? [
      offset(8),
    ],
    placement,
    strategy,
    whileElementsMounted: autoUpdate,
  })

  const setContainerElementRef = useCallback((element: HTMLDivElement | null) => {
    setContainerElement(element)
    refs.setFloating(element)
  }, [refs])

  const onClickOutside = useEffectEvent((e: MouseEvent) => {
    if (!referenceElement) {
      return
    }

    const path: Array<EventTarget | VirtualElement> = 'composedPath' in e
      ? e.composedPath()
      : (e as { path: Element[] }).path
    if (path.includes(referenceElement)) {
      return
    }

    if (!path.includes(containerElement!)) {
      onClose?.('click')
      return
    }

    const button = path
      .filter((element): element is HTMLButtonElement => element instanceof HTMLButtonElement)
      .at(-1)

    if (button && !button.disabled) {
      onClose?.('click')
    }
  })

  const onKeyboardPressed = useEffectEvent((e: KeyboardEvent) => {
    if (referenceElement && e.key === 'Escape') {
      onClose?.('escape')
    }
  })

  useLayoutEffect(() => {
    document.body.addEventListener('click', onClickOutside, true)
    window.addEventListener('keydown', onKeyboardPressed, true)
    return () => {
      document.body.removeEventListener('click', onClickOutside, true)
      window.removeEventListener('keydown', onKeyboardPressed, true)
    }
  }, [])

  useLayoutEffect(() => {
    refs.setReference(referenceElement)
  }, [refs, referenceElement])

  return (
    <Portal portal={portal}>
      <div
        {...props}
        ref={setContainerElementRef}
        style={floatingStyles}
        className={clsx(
          strategy === 'absolute' && 'absolute',
          strategy === 'fixed' && 'fixed',
          'z-20',
          className,
        )}
      >
        {children}
      </div>
    </Portal>
  )
}
