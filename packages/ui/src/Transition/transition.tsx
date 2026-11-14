import { useCallback, useState, type TransitionEvent, type ElementType } from 'react'
import { clsx, type OverridableComponent, type OverridableComponentProps } from '../utils'

type TransitionOverridableTypeMap = {
  props: {
    show?: boolean
    className: string
    /**
     * CSS property name to track for during the transition.
     */
    transitionPropertyName: string
    /**
     * Keeps the contents interactive when hidden. Useful for situation where
     * hidden does not completely hides the contents. When set, the value of
     * `unmountWhenHidden` will be ignored.
     */
    keepInteractiveWhenHidden?: boolean
    unmountWhenHidden?: boolean
    onHidden?: () => void
    onHide?: () => void
    onShow?: () => void
    onShowing?: () => void
  }
  defaultComponent: 'div'
}

export type TransitionImplementationBaseProps = {
  /**
   * Shows or hides the contents.
   */
  show?: boolean
  className?: string
  /**
   * When set, the contents will be unmounted from the tree if the element
   * is hidden and transition has been finished.
   */
  unmountWhenHidden?: boolean
  /**
   * Callback called when the hide animation is finished, which means the
   * content is completely hidden. If `unmountWhenHidden` is set,
   * the contents will still be present until react re-renders the component.
   */
  onHidden?: () => void
  /**
   * Callback called when the hide animation starts. The contents are completely
   * hidden and the animation has just started.
   */
  onHide?: () => void
  /**
   * Callback called when the show animation starts. The contents are hidden and
   * the animation has started. If `unmountWhenHidden` is set, the contents have
   * just been mounted.
   */
  onShow?: () => void
  /**
   * Callback called when the show animation is finished. The contents are completely
   * visible.
   */
  onShowing?: () => void
}

export type TransitionProps<BaseElement extends ElementType = TransitionOverridableTypeMap['defaultComponent']> =
  OverridableComponentProps<TransitionOverridableTypeMap, BaseElement>

/**
 * Component that serves as a base for implementing transitions over the children.
 * Shows and hides the contents using `aria-hidden` attribute. Includes certain
 * utilities like:
 * - Hide content with `visibility: hidden` and make it not-interactive
 * - Unmount content when hidden
 * - Start and end callbacks for hide and show events
 * - Default transition durations for enter and exit
 *
 * Implementors should add shown styles inside the `className` property. Hidden
 * styles also go inside the `className` but must be prefixed with `aria-hidden:`
 * to apply only when hidden.
 */
const Transition: OverridableComponent<TransitionOverridableTypeMap> = ({
  children,
  className,
  component: Component = 'div',
  keepInteractiveWhenHidden,
  onHidden,
  onHide,
  onShow,
  onShowing,
  onTransitionEnd,
  onTransitionStart,
  show,
  transitionPropertyName,
  unmountWhenHidden = false,
  ...props
}: TransitionProps) => {
  const [animationFinished, setAnimationFinished] = useState(true)

  const onTransitionEndWrapper = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setAnimationFinished(true)
      if (e.propertyName === transitionPropertyName) {
        if (show) {
          onShowing?.()
        } else {
          onHidden?.()
        }
      }
    }
    onTransitionEnd?.(e)
  }, [onHidden, onShowing, onTransitionEnd, show, transitionPropertyName])

  const onTransitionStartWrapper = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target && e.nativeEvent.propertyName === transitionPropertyName) {
      if (show) {
        onShow?.()
      } else {
        onHide?.()
      }
    }
    onTransitionStart?.(e)
  }, [onHide, onShow, onTransitionStart, show, transitionPropertyName])

  if (show && animationFinished) {
    setAnimationFinished(false)
  }

  return (
    <Component
      {...props}
      className={clsx(
        'visible transition-all duration-300',
        'aria-hidden:duration-150',
        !keepInteractiveWhenHidden && 'aria-hidden:invisible',
        (!show && animationFinished && !keepInteractiveWhenHidden) && 'pointer-events-none',
        className,
      )}
      onTransitionEnd={onTransitionEndWrapper}
      onTransitionStart={onTransitionStartWrapper}
      aria-hidden={!show}
      role="presentation"
    >
      {(show || !unmountWhenHidden || !animationFinished || keepInteractiveWhenHidden) && children}
    </Component>
  )
}

export default Transition
