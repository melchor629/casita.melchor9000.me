import type { ComponentProps, ReactNode } from 'react'
import { clsx } from '../utils'

export type TextInputProps = Readonly<Omit<ComponentProps<'input'>, 'size'> & {
  type: 'text' | 'password' | 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'search' |
  'tel' | 'time' | 'url' | 'week'
  size?: 'small' | 'medium' | 'large'
  endAdornment?: ReactNode
  startAdornment?: ReactNode
  fullWidth?: boolean
}>

const TextInput = ({
  children,
  className,
  endAdornment,
  fullWidth,
  size = 'medium',
  startAdornment,
  type,
  ...props
}: TextInputProps) => (
  <div
    className={clsx(
      'max-w-full rounded-md flex gap-1',
      fullWidth && 'w-full',
      'bg-text-main/10 not-has-disabled:hover:bg-text-main/15',
      'border border-text-secondary group-[.error]/form-control:border-error-main',
      size === 'small' && 'px-1.5 py-1 text-body-small placeholder:text-body-small',
      size === 'medium' && 'px-2 py-1',
      size === 'large' && 'px-3 py-1.5',
      'focus-within:outline-3 outline-0 outline-text-secondary/50 group-[.error]/form-control:outline-error-main/50',
      'has-disabled:opacity-disabled',
      'transition-all',
      className,
    )}
  >
    {startAdornment && (
      <div
        className={clsx(
          'flex items-center',
          size === 'small' && '-ml-0.5 -my-0.5',
          size === 'medium' && '-ml-1 -my-0.5',
          size === 'large' && '-ml-1.5 -my-1',
        )}
      >
        {startAdornment}
      </div>
    )}
    <input
      type={type}
      className={clsx('appearance-none w-full focus:outline-none')}
      {...props}
    />
    {endAdornment && (
      <div
        className={clsx(
          'flex items-center',
          size === 'small' && '-mr-0.5 -my-0.5',
          size === 'medium' && '-mr-1 -my-0.5',
          size === 'large' && '-mr-1.5 -my-1',
        )}
      >
        {endAdornment}
      </div>
    )}
  </div>
)

export default TextInput
