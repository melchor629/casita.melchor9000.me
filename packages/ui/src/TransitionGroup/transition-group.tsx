import type { ComponentPropsWithRef } from 'react'
import { clsx } from '../utils'

export type TransitionGroupProps = Readonly<ComponentPropsWithRef<'div'>>

/**
 * Helper to implement a transition group of showing one element at a time, and
 * transition between elements when changing. This is a basic implementation, do not
 * expect to work in all scenarios.
 */
const TransitionGroup = ({ children, className, ...props }: TransitionGroupProps) => (
  <div
    {...props}
    className={clsx(
      'grid',
      '*:[grid-area:1/-1]',
      className,
    )}
  >
    {children}
  </div>
)

export default TransitionGroup
