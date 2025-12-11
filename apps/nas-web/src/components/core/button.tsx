import type { ElementType } from 'react'
import { clsx, type OverridableComponent, type OverridableComponentProps } from './utils'

type ButtonTypeMap = {
  props: {
    color?: 'primary' | 'secondary'
    variant?: 'filled' | 'text'
    size?: 'large' | 'medium' | 'small'
  }
  defaultComponent: 'button'
}

export type ButtonProps<C extends ElementType = ButtonTypeMap['defaultComponent']> = OverridableComponentProps<ButtonTypeMap, C>

const Button: OverridableComponent<ButtonTypeMap> = ({
  className,
  color = 'primary',
  component: Comp = 'button',
  size = 'medium',
  variant = 'filled',
  ...props
}: ButtonProps) => {
  return (
    <Comp
      className={clsx(
        'inline-block',
        'rounded-md',
        variant === 'filled' && color === 'primary' && 'bg-primary-main text-text-dark',
        variant === 'filled' && color === 'secondary' && 'bg-secondary-main text-text-dark',
        variant === 'text' && color === 'primary' && 'text-primary-main',
        variant === 'text' && color === 'secondary' && 'text-secondary-main',
        size === 'small' && 'px-1 py-0.5 text-sm',
        size === 'medium' && 'px-3 py-1.5 text-base',
        size === 'large' && 'px-4 py-2 text-lg',
        'transition-all',
        'hover:opacity-75',
        className,
      )}
      {...props}
    />
  )
}

export default Button
