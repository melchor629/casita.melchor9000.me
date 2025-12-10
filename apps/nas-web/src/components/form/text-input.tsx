import type { ComponentPropsWithoutRef, FC } from 'react'

type TextInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & {
  readonly id?: string
  readonly className?: string
  readonly isInvalid?: boolean
  readonly isValid?: boolean
  readonly invalidFeedback?: string
  readonly validFeedback?: string
  readonly helpText?: React.ReactNode
  readonly type: 'text' | 'password' | 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'search' |
  'tel' | 'time' | 'url' | 'week'
  readonly size?: 'sm' | 'lg'
}

const TextInput: FC<TextInputProps> = ({
  children,
  className,
  helpText,
  id,
  invalidFeedback,
  isInvalid,
  isValid,
  size,
  type,
  validFeedback,
  ...props
}) => (
  <div className="form-group">
    <label htmlFor={id}>{children}</label>
    <input
      type={type}
      id={id}
      name={id}
      aria-describedby={helpText ? `${id}-help-text` : undefined}
      className={[
        'form-control',
        isInvalid && 'is-invalid',
        isValid && 'is-valid',
        size && `form-control-${size}`,
      ].filter((f) => f).join(' ')}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
    {invalidFeedback && <div className="invalid-feedback">{invalidFeedback}</div>}
    {validFeedback && <div className="valid-feedback">{validFeedback}</div>}
    {helpText && (
      <small id={`${id}-help-text`} className="form-text text-muted">{helpText}</small>
    )}
  </div>
)

export default TextInput
