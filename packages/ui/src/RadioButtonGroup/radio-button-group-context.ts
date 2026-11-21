import { createContext, use } from 'react'

export const RadioButtonGroupContext = createContext<{
  name: string
  value: string | null | undefined
  setValue: (value: string) => void
} | null>(null)

export const useRadioButtonGroup = () => use(RadioButtonGroupContext)
