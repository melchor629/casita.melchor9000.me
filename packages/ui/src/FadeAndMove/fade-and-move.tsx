import type { ComponentPropsWithRef } from 'react'
import Transition, { type TransitionImplementationBaseProps } from '../Transition'
import { clsx } from '../utils'

export type FadeAndMoveProps = Readonly<
  ComponentPropsWithRef<'div'> & TransitionImplementationBaseProps
>

export default function FadeAndMove({ children, className, ...props }: FadeAndMoveProps) {
  return (
    <Transition
      {...props}
      className={clsx(
        'translate-y-0 opacity-100 scale-100',
        'aria-hidden:translate-y-4 aria-hidden:opacity-0 aria-hidden:blur-sm aria-hidden:scale-[97%]',
        className,
      )}
      transitionPropertyName="opacity"
    >
      {children}
    </Transition>
  )
}
