import clsx from 'clsx'
import type { ComponentProps } from 'react'

export type SwitchProps = Omit<ComponentProps<'input'>, 'type'>

const Switch = ({ children, className, ...props }: SwitchProps) => (
  <input
    {...props}
    type="checkbox"
    className={clsx(
      'w-[2em] h-[1em] rounded-full relative',
      'appearance-none border border-text-secondary bg-text-main/10 dark:bg-text-main/20',
      'align-middle not-disabled:cursor-pointer',
      'hover:not-checked:border-text-main',
      'checked:border-primary-main/75 checked:bg-primary-main/20 dark:checked:bg-primary-main/30',
      'focus:outline-2 outline-text-secondary/50 checked:outline-primary-main/30 dark:checked:outline-primary-main/40',
      'disabled:opacity-disabled',
      'transition-all',

      'after:inline-block after:w-3 after:h-3 after:mb-px after:translate-x-0.5 after:-translate-y-1',
      'after:rounded-full after:content-[\' \'] after:bg-text-main checked:after:bg-text-main after:shadow-sm',
      'after:transition-transform',
      'hover:after:scale-90',
      'checked:after:translate-x-[1em]',

      className,
    )}
  />
)

export default Switch
