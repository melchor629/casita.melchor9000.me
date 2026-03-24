import { useCallback, useState, type TransitionEvent, type ComponentPropsWithRef } from 'react'
import { clsx } from '../utils'

export type FadeAndMoveProps = Readonly<ComponentPropsWithRef<'div'> & {
  show?: boolean
  unmountWhenHidden?: boolean
}>

export default function FadeAndMove({
  children,
  className,
  onTransitionEnd,
  show,
  unmountWhenHidden = false,
  ...props
}: FadeAndMoveProps) {
  const [animationFinished, setAnimationFinished] = useState(true)

  const onTransitionEndWrapper = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setAnimationFinished(true)
    }
    onTransitionEnd?.(e)
  }, [onTransitionEnd])

  if (show && animationFinished) {
    setAnimationFinished(false)
  }

  return (
    <div
      {...props}
      className={clsx(
        'invisible translate-y-4 opacity-0 transition-all',
        'data-[show=true]:visible data-[show=true]:translate-y-0 data-[show=true]:opacity-100',
        (!show && animationFinished) && 'pointer-events-none',
        className,
      )}
      onTransitionEnd={onTransitionEndWrapper}
      data-show={show}
    >
      {(show || !unmountWhenHidden || !animationFinished) && children}
    </div>
  )
}
