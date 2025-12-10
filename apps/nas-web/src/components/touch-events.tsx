import { type ComponentType, useCallback, useState } from 'react'

interface ComponentTypeProps {
  onTouchCancel?: React.TouchEventHandler
  onTouchMove?: React.TouchEventHandler
  onTouchStart?: React.TouchEventHandler
  onTouchEnd?: React.TouchEventHandler
  onContextMenu?: React.MouseEventHandler
}

interface TouchEventProps {
  readonly onTap?: (e: React.TouchEvent) => void
  readonly onLongTap?: (e: React.TouchEvent) => void
  readonly longTapDelay?: number
  readonly onContextMenu?: (e: React.MouseEvent) => void
}

function withTouchEvents<CTP extends ComponentTypeProps>(
  Component: ComponentType<CTP>,
): React.FC<Omit<CTP, keyof ComponentTypeProps> & TouchEventProps> {
  function WithTouchEvents({
    longTapDelay,
    onContextMenu,
    onLongTap,
    onTap,
    ...props
  }: Omit<CTP, keyof ComponentTypeProps> & TouchEventProps) {
    const [timeoutHandler, setTimeoutHandler] = useState<number | null>(null)
    const [
      [touchStartTime, touchStartPosition],
      setTouchStart,
    ] = useState<[ Date, React.Touch ] | []>([])

    const clearTimeoutHandler = useCallback(() => {
      if (timeoutHandler !== null) {
        clearTimeout(timeoutHandler)
        setTimeoutHandler(null)
      }
    }, [timeoutHandler])

    const touchDiffDistance = useCallback((a: React.Touch, b: React.Touch) => {
      const posDiff = {
        x: b.clientX - a.clientX,
        y: b.clientY - a.clientY,
      }
      const posDiffDistance = Math.sqrt(posDiff.x ** 2 + posDiff.y ** 2)
      return [posDiff, posDiffDistance] as const
    }, [])

    const onTouchStart: React.TouchEventHandler = useCallback((e) => {
      setTouchStart([new Date(), e.touches[0]])

      clearTimeoutHandler()
      setTimeoutHandler(setTimeout(() => {
        if (onLongTap) {
          onLongTap(e)
        }

        setTimeoutHandler(null)
      }, longTapDelay || 500) as unknown as number)
    }, [clearTimeoutHandler, longTapDelay, onLongTap])

    const onTouchEnd: React.TouchEventHandler = useCallback((e) => {
      if (!e.cancelable) {
        return
      }

      if (!touchStartTime || !touchStartPosition) {
        return
      }

      e.preventDefault()
      const timeDiff = Date.now() - +touchStartTime
      const [, posDiffDistance] = touchDiffDistance(touchStartPosition, e.changedTouches[0])
      if (posDiffDistance <= 15 && timeDiff < (longTapDelay || 500)) {
        // Short-tap
        clearTimeoutHandler()
        if (onTap) {
          onTap(e)
        }
      } else {
        // Long-tap
        if (timeoutHandler !== null) {
          if (onLongTap) {
            onLongTap(e)
          }
        }
        clearTimeoutHandler()
      }

      setTouchStart([])
    }, [
      touchStartTime,
      touchStartPosition,
      clearTimeoutHandler,
      timeoutHandler,
      touchDiffDistance,
      longTapDelay,
      onLongTap,
      onTap,
    ])

    const onTouchMove: React.TouchEventHandler = useCallback((e) => (
      touchDiffDistance(touchStartPosition!, e.changedTouches[0])[1] > 15 && clearTimeoutHandler()
    ), [touchDiffDistance, touchStartPosition, clearTimeoutHandler])

    const onContextMenu2: React.MouseEventHandler = useCallback((e) => {
      if (!touchStartTime || !touchStartPosition) {
        onContextMenu?.(e)
        return
      }

      e.preventDefault()
    }, [touchStartTime, touchStartPosition, onContextMenu])

    return (
      <Component
        {...(props as CTP)}
        onTouchCancel={clearTimeoutHandler}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onContextMenu={onContextMenu2}
      />
    )
  }
  return WithTouchEvents
}

export default withTouchEvents
