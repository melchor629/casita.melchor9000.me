import type { ComponentProps } from 'react'
import { clsx } from '../utils'

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

const Checkbox = ({ children, className, ...props }: ComponentProps<'input'>) => (
  <input
    {...props}
    type="checkbox"
    className={clsx(
      'w-[1em] h-[1em] rounded-sm',
      'appearance-none border border-text-secondary bg-transparent',
      'hover:not-checked:not-disabled:border-text-main',
      'checked:border-primary-selected checked:bg-primary-main checked:bg-(image:--svg-check)',
      'focus:outline-2 outline-text-secondary/50 checked:outline-primary-selected/30',
      'disabled:opacity-disabled',
      'transition-all not-disabled:cursor-pointer',
      className,
    )}
  />
)

export default Checkbox
