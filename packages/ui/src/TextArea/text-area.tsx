import type { ComponentPropsWithRef } from 'react'
import { clsx } from '../utils'

export type TextAreaProps = Readonly<ComponentPropsWithRef<'textarea'> & {
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
}>

const TextArea = ({ children, className, fullWidth, size, ...props }: TextAreaProps) => (
  <textarea
    className={clsx(
      'max-w-full rounded-md flex gap-1',
      fullWidth && 'w-full',
      'bg-text-main/10 not-disabled:hover:bg-text-main/15',
      'border border-text-secondary group-[.error]/form-control:border-error-main',
      size === 'small' && 'px-1.5 py-1 text-body-small placeholder:text-body-small',
      size === 'medium' && 'px-2 py-1',
      size === 'large' && 'px-3 py-1.5',
      'focus-within:outline-3 outline-0 outline-text-secondary/50 group-[.error]/form-control:outline-error-main/50',
      'disabled:opacity-disabled',
      'transition-all',
      className,
    )}
    {...props}
  >
    {children}
  </textarea>
)

export default TextArea
