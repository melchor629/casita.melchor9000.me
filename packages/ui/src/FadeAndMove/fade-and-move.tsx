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
        'visible translate-y-0 opacity-100 scale-100 transition-all duration-200',
        'aria-hidden:invisible aria-hidden:translate-y-4 aria-hidden:opacity-0 aria-hidden:blur-sm aria-hidden:scale-[97%]',
        (!show && animationFinished) && 'pointer-events-none',
        className,
      )}
      onTransitionEnd={onTransitionEndWrapper}
      aria-hidden={!show}
    >
      {(show || !unmountWhenHidden || !animationFinished) && children}
    </div>
  )
}
