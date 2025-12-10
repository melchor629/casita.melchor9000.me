import type { DetailedHTMLProps, FunctionComponent, InputHTMLAttributes } from 'react'

interface CheckboxProps extends DetailedHTMLProps<
InputHTMLAttributes<HTMLInputElement>,
HTMLInputElement
> {
  readonly className?: string
  readonly id?: string
  readonly isInvalid?: boolean
  readonly isValid?: boolean
  readonly invalidFeedback?: string
  readonly validFeedback?: string
}

const CheckboxImpl: FunctionComponent<CheckboxProps & { readonly _customClass: string }> = ({
  _customClass,
  children,
  className = '',
  id,
  invalidFeedback,
  isInvalid = false,
  isValid = false,
  validFeedback,
  ...props
}) => (
  <div className={`form-check ${className ?? ''} ${_customClass ?? ''}`}>
    <input
      type="checkbox"
      id={id}
      name={id}
      className={`form-check-input ${isInvalid ? 'is-invalid' : ''} ${isValid ? 'is-valid' : ''}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
    <label className="form-check-label" htmlFor={id}>{children}</label>
    {invalidFeedback && <div className="invalid-feedback">{invalidFeedback}</div>}
    {validFeedback && <div className="valid-feedback">{validFeedback}</div>}
  </div>
)

export function Checkbox(props: CheckboxProps) {
  return <CheckboxImpl {...props} _customClass="" />
}

export function Switch(props: CheckboxProps) {
  return <CheckboxImpl {...props} _customClass="form-switch" />
}
