import { useCallback } from 'react'
import Button, { type ButtonProps } from '../Button'
import { useRadioButtonGroup } from './radio-button-group-context'

export type RadioButtonProps = Readonly<Omit<ButtonProps<'button'>, 'variant' | 'color'> & {
  value: string
}>

const RadioButton = ({ children, value, ...props }: RadioButtonProps) => {
  const ctx = useRadioButtonGroup()
  if (!ctx) {
    throw new Error('RadioButton can only be used inside a RadioButtonGroup')
  }

  return (
    <Button
      {...props}
      role="checkbox"
      aria-checked={value === ctx.value}
      onClick={useCallback(() => ctx.setValue(value), [ctx, value])}
    >
      {children}

      <input
        type="radio"
        name={ctx.name}
        id={`${ctx.name}:${value}`}
        className="hidden"
        checked={value === ctx.value}
        readOnly
      />
    </Button>
  )
}

export default RadioButton
