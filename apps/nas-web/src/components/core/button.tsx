import type { ElementType, ReactElement } from 'react'
import { clsx, type OverridableComponent, type OverridableComponentProps } from './utils'

type ButtonTypeMap = {
  props: {
    color?: 'primary' | 'secondary' | 'neutral' | 'error'
    variant?: 'filled' | 'text'
    size?: 'large' | 'medium' | 'small'
    icon?: ReactElement
  }
  defaultComponent: 'button'
}

export type ButtonProps<C extends ElementType = ButtonTypeMap['defaultComponent']> = OverridableComponentProps<ButtonTypeMap, C>

const Button: OverridableComponent<ButtonTypeMap> = ({
  children,
  className,
  color = 'primary',
  component: Comp = 'button',
  icon,
  size = 'medium',
  variant = 'filled',
  ...props
}: ButtonProps) => {
  return (
    <Comp
      className={clsx(
        'inline-flex rounded-md items-center',
        'cursor-pointer select-none',
        variant === 'filled' && color === 'primary' && 'bg-primary-main text-text-contrasted border-primary-alt aria-checked:bg-primary-selected',
        variant === 'filled' && color === 'secondary' && 'bg-secondary-main text-text-contrasted border-secondary-alt aria-checked:bg-secondary-selected',
        variant === 'filled' && color === 'neutral' && 'bg-text-main text-text-contrasted border-text-contrasted',
        variant === 'filled' && color === 'error' && 'bg-error-main text-text-contrasted border-error-alt aria-checked:bg-error-selected',
        variant === 'text' && color === 'primary' && 'text-primary-main border-primary-main aria-checked:bg-primary-selected/10',
        variant === 'text' && color === 'secondary' && 'text-secondary-main border-secondary-main aria-checked:bg-secondary-selected/10',
        variant === 'text' && color === 'neutral' && 'text-text-main border-text-main aria-checked:bg-text-secondary/20',
        variant === 'text' && color === 'error' && 'text-error-main border-error-main aria-checked:bg-error-selected/10',
        size === 'small' && 'px-1.5 py-1.5 text-body-small',
        size === 'medium' && 'px-2 py-1.5 text-body',
        size === 'large' && 'px-3 py-2 text-body-large',
        'transition-all leading-none',
        'disabled:cursor-default disabled:opacity-65',
        variant === 'filled' && 'hover:not-disabled:opacity-75',
        variant === 'text' && color === 'primary' && 'hover:not-disabled:bg-primary-main/15 aria-checked:hover:not-disabled:bg-primary-selected/20',
        variant === 'text' && color === 'secondary' && 'hover:not-disabled:bg-secondary-main/15 aria-checked:hover:not-disabled:bg-secondary-selected/20',
        variant === 'text' && color === 'neutral' && 'hover:not-disabled:bg-text-main/10 aria-checked:hover:not-disabled:bg-text-secondary/30',
        variant === 'text' && color === 'error' && 'hover:not-disabled:bg-error-main/15 aria-checked:hover:not-disabled:bg-error-selected/20',
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          className={clsx(
            !!children && 'mr-1',
            size === 'small' && 'text-body',
            size === 'medium' && 'text-body-large',
            size === 'large' && 'text-h4',
            !children && size === 'small' && '',
            !children && size === 'medium' && '-mx-0.5',
            !children && size === 'large' && '-mx-1',
            'leading-0',
          )}
        >
          {icon}
        </span>
      )}
      {children}
    </Comp>
  )
}

export default Button
