import type { ComponentPropsWithRef, FC } from 'react'

type SelectProps = Omit<ComponentPropsWithRef<'select'>, 'size'> & {
  readonly id?: string
  readonly label?: string
  readonly isInvalid?: boolean
  readonly isValid?: boolean
  readonly invalidFeedback?: string
  readonly validFeedback?: string
  readonly size?: 'sm' | 'lg'
}

const Select: FC<SelectProps> = ({
  children,
  id,
  invalidFeedback,
  isInvalid,
  isValid,
  label,
  size,
  validFeedback,
  ...props
}) => (
  <div className="form-group">
    {label && <label htmlFor={id}>{label}</label>}
    <select
      id={id}
      name={id}
      className={[
        'custom-select',
        isInvalid && 'is-invalid',
        isValid && 'is-valid',
        size && `custom-select-${size}`,
      ].filter((f) => f).join(' ')}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children}
    </select>
    {invalidFeedback && <div className="invalid-feedback">{invalidFeedback}</div>}
    {validFeedback && <div className="valid-feedback">{validFeedback}</div>}
  </div>
)

export default Select
