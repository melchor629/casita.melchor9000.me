import { useCallback, useState } from 'react'
import ButtonGroup, { type ButtonGroupProps } from '../ButtonGroup'
import { RadioButtonGroupContext } from './radio-button-group-context'

export type RadioButtonGroupProps = Readonly<Omit<ButtonGroupProps, 'defaultValue' | 'onChange'> & {
  defaultValue?: string
  name: string
  onChange?: (value: string) => void
  value?: string
}>

const RadioButtonGroup = ({ children, color, defaultValue, name, onChange, size, value: controlledValue, variant }: RadioButtonGroupProps) => {
  const [value, setValue] = useState(defaultValue)

  const newValue = useCallback((value: string) => {
    setValue(value)
    onChange?.(value)
  }, [onChange])

  return (
    <ButtonGroup color={color} size={size} variant={variant} role="radiogroup">
      <RadioButtonGroupContext
        value={{
          name,
          value: controlledValue || value,
          setValue: newValue,
        }}
      >
        {children}
      </RadioButtonGroupContext>
    </ButtonGroup>
  )
}

export default RadioButtonGroup
