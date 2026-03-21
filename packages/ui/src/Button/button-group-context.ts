import { createContext, use } from 'react'
import type { ButtonProps } from './button'

export const ButtonGroupContext = createContext<{
  color?: ButtonProps['color']
  disabled?: ButtonProps['disabled']
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
}>({})

export const useButtonGroup = () => use(ButtonGroupContext)
