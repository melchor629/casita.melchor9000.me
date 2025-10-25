import { clsx } from 'clsx'
import type { ComponentProps } from 'preact'
import LoadingSpinner from './loading-spinner'
import type { OverridableComponent } from './types'

type ButtonProps = {
  size?: 'sm' | 'md'
  className?: string
  loading?: boolean
  disabled?: boolean
}
type ButtonComponent = OverridableComponent<ButtonProps, 'button', { className?: string, role?: never }>

const Button: ButtonComponent = ({
  // @ts-expect-error asd
  as: Component = 'button',
  children,
  className,
  disabled,
  loading,
  ref,
  role,
  size = 'md',
  ...props
}: ComponentProps<ButtonComponent>) => (
  <Component
    ref={ref}
    className={clsx(
      'inline-block relative',
      size === 'md' && 'px-3 py-1',
      size === 'sm' && 'text-sm px-2 py-1',
      'border rounded-md border-black/80 dark:border-white/80',
      'text-center',
      'hover:bg-gray-100/90 dark:hover:bg-gray-900/25',
      'active:bg-gray-100/50 dark:active:bg-gray-900/50',
      (disabled || loading) && 'opacity-80 active:bg-gray-100/90 dark:active:bg-gray-900/25',
      'transition ease-in-out duration-100',
      'cursor-pointer',
      className,
    )}
    role={Component === 'a' ? role ?? 'button' : role}
    disabled={disabled || loading}
    {...props}
  >
    <div className={clsx('inline-block', loading && 'invisible')}>{children}</div>
    {loading && (
      <div className="absolute top-0 left-0 w-full h-full">
        <LoadingSpinner size={size} />
      </div>
    )}
  </Component>
)

export default Button
