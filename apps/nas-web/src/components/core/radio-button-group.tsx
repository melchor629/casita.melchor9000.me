import { createContext, use, useCallback, useState } from 'react'
import Button, { type ButtonProps } from './button'
import ButtonGroup, { type ButtonGroupProps } from './button-group'

const RadioButtonGroupContext = createContext<{
  name: string
  value: string | null | undefined
  setValue: (value: string) => void
  variant?: ButtonProps['variant']
  color?: ButtonProps['color']
  size?: ButtonProps['size']
} | null>(null)

export type RadioButtonGroupProps = Readonly<Omit<ButtonGroupProps, 'defaultValue' | 'onChange'> & {
  defaultValue?: string
  name: string
  onChange?: (value: string) => void
  value?: string
  variant?: ButtonProps['variant']
  color?: ButtonProps['color']
  size?: ButtonProps['size']
}>

export type RadioButtonProps = Readonly<Omit<ButtonProps<'label'>, 'variant' | 'color'> & {
  value: string
}>

export const RadioButtonGroup = ({ children, color, defaultValue, name, onChange, size, value: controlledValue, variant }: RadioButtonGroupProps) => {
  const [value, setValue] = useState(defaultValue)

  const newValue = useCallback((value: string) => {
    setValue(value)
    onChange?.(value)
  }, [onChange])

  return (
    <ButtonGroup>
      <RadioButtonGroupContext
        value={{
          name,
          value: controlledValue || value,
          setValue: newValue,
          variant,
          color,
          size,
        }}
      >
        {children}
      </RadioButtonGroupContext>
    </ButtonGroup>
  )
}

export const RadioButton = ({ children, value, ...props }: RadioButtonProps) => {
  const ctx = use(RadioButtonGroupContext)
  if (!ctx) {
    throw new Error('RadioButton can only be used inside a RadioButtonGroup')
  }

  return (
    <Button
      {...props}
      component="label"
      htmlFor={`${ctx.name}:${value}`}
      aria-checked={value === ctx.value}
      variant={ctx.variant}
      color={ctx.color}
      size={ctx.size}
    >
      {children}

      <input
        type="radio"
        name={ctx.name}
        id={`${ctx.name}:${value}`}
        className="hidden"
        checked={value === ctx.value}
        onChange={useCallback(() => ctx.setValue(value), [ctx, value])}
      />
    </Button>
  )
}
