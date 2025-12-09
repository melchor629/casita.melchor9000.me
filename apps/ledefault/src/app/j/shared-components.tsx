/* eslint-disable react/jsx-props-no-spreading */
import { clsx } from 'clsx'
import type { ComponentPropsWithRef } from 'react'

type TextAreaProps = Readonly<ComponentPropsWithRef<'textarea'>>
export function TextArea({ children, className, ref, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      ref={ref}
      className={clsx(
        'bg-primary-subtle hover:bg-primary-hover',
        'px-2 py-1',
        'rounded-md shadow-lg',
        'resize-y',
        'outline-2 outline-offset-2 not-focus:not-active:outline-hidden',
        'outline-primary-hover',
        'transition-colors',
        className,
      )}
    >
      {children}
    </textarea>
  )
}

type CharButtonProps = Readonly<ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'secondary'
}>
export function CharButton({ children, className, ref, variant = 'primary', ...props }: CharButtonProps) {
  return (
    <button
      {...props}
      ref={ref}
      className={clsx(
        'relative',
        'min-w-12',
        'outline-2 outline-offset-2',
        'not-focus:not-active:outline-hidden',
        'rounded-lg shadow-md',
        'cursor-pointer',
        'transition-colors',
        'disabled:opacity-75',
        variant === 'primary' && [
          'px-4 py-3',
          'bg-primary-elevated text-primary-text',
          'hover:not-disabled:bg-primary-hover',
          'outline-primary-hover',
        ],
        variant === 'secondary' && [
          'px-2 py-1',
          'bg-transparent border border-solid border-primary-text',
          'hover:not-disabled:bg-primary-hover/50',
          'outline-primary-text',
        ],
        className,
      )}
    >
      {children}
    </button>
  )
}

type NaisTableProps = Readonly<ComponentPropsWithRef<'table'>>
export function NaisTable({ children, className, ref, ...props }: NaisTableProps) {
  return (
    <table
      {...props}
      ref={ref}
      className={clsx(
        'border-separate border-spacing-x-2 border-spacing-y-1',
        'w-full',
        'text-center',
        'mb-2',
        className,
      )}
    >
      {children}
    </table>
  )
}
