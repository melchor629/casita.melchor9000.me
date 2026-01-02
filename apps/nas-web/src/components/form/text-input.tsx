import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'
import Text from '../core/text'
import { clsx } from '../core/utils'

type TextInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & {
  readonly id?: string
  readonly className?: string
  readonly helpText?: React.ReactNode
  readonly type: 'text' | 'password' | 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'search' |
  'tel' | 'time' | 'url' | 'week'
  readonly size?: 'small' | 'medium' | 'large'
  readonly endAdornment?: ReactNode
  readonly fullWidth?: boolean
}

const TextInput: FC<TextInputProps> = ({
  children,
  className,
  endAdornment,
  fullWidth,
  helpText,
  id,
  size = 'medium',
  type,
  ...props
}) => (
  <div className={clsx('max-w-full', fullWidth && 'w-full', className)}>
    {children && id && <Text component="label" htmlFor={id} className="inline-block" ellipsize>{children}</Text>}
    <div
      className={clsx(
        'w-full rounded-md flex gap-1',
        'border border-text-secondary',
        size === 'small' && 'px-1.5 py-1 text-body-small placeholder:text-body-small',
        size === 'medium' && 'px-2 py-1',
        size === 'large' && 'px-3 py-1.5',
        'focus-within:outline-3 outline-0 outline-text-secondary/50',
        'transition-all',
        helpText && 'mb-0.5',
      )}
    >
      <input
        type={type}
        id={id}
        name={id}
        aria-describedby={helpText ? `${id}-help-text` : undefined}
        className={clsx('appearance-none w-full focus:outline-none')}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
      {endAdornment && (
        <div
          className={clsx(
            size === 'small' && '-mr-0.5 -my-0.5',
            size === 'medium' && '-mr-1 -my-0.5',
            size === 'large' && '-mr-1.5 -my-1',
          )}
        >
          {endAdornment}
        </div>
      )}
    </div>
    {helpText && (
      <Text id={`${id}-help-text`} size="bodySmall" color="textSecondary">{helpText}</Text>
    )}
  </div>
)

export default TextInput
