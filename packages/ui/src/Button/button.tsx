import type { ElementType, ReactElement } from 'react'
import CircularProgress from '../CircularProgress'
import { clsx, type OverridableComponent, type OverridableComponentProps } from '../utils'
import { useButtonGroup } from './button-group-context'

type ButtonTypeMap = {
  props: {
    /**
     * The color the button has. Use Primary for the important button.
     * Use Secondary for other buttons next to the Primary. Use Error
     * to indicate a dangerous action, and cannot be used alongside
     * Primary. Use neutral for other buttons.
     * @default 'primary'
     */
    color?: 'primary' | 'secondary' | 'neutral' | 'warning' | 'error'
    /**
     * Disables the button in a way that cannot be interacted with.
     */
    disabled?: boolean
    /**
     * If filled, renders the icon at the start of the button. If the
     * button does not contain any children, then just renders the
     * icon. Styles are a bit changed when only an icon is rendered.
     */
    icon?: ReactElement
    loading?: boolean
    /**
     * The variant of the button. Filled has a background color, whereas
     * text colours the text instead.
     * @default 'filled'
     */
    variant?: 'filled' | 'text'
    /**
     * The size of the button.
     * @default 'medium'
     */
    size?: 'large' | 'medium' | 'small'
  }
  defaultComponent: 'button'
}

export type ButtonProps<C extends ElementType = ButtonTypeMap['defaultComponent']> = OverridableComponentProps<ButtonTypeMap, C>

const Button: OverridableComponent<ButtonTypeMap> = ({
  children,
  className,
  color,
  component: Comp = 'button',
  disabled,
  icon,
  loading = false,
  size,
  variant,
  ...props
}: ButtonProps) => {
  const context = useButtonGroup()
  color ??= context.color ?? 'primary'
  disabled ??= context.disabled ?? false
  size ??= context.size ?? 'medium'
  variant ??= context.variant ?? 'filled'

  return (
    <Comp
      className={clsx(
        'relative inline-flex rounded-md items-center',
        'cursor-pointer select-none font-medium',
        variant === 'filled' && color === 'primary' && 'bg-primary-main text-text-contrasted border-primary-alt aria-checked:bg-primary-selected',
        variant === 'filled' && color === 'secondary' && 'bg-secondary-main text-text-contrasted border-secondary-alt aria-checked:bg-secondary-selected',
        variant === 'filled' && color === 'neutral' && 'bg-text-main text-text-contrasted border-text-contrasted',
        variant === 'filled' && color === 'warning' && 'bg-warning-main text-text-contrasted border-warning-alt aria-checked:bg-warning-selected',
        variant === 'filled' && color === 'error' && 'bg-error-main text-text-contrasted border-error-alt aria-checked:bg-error-selected',
        variant === 'text' && color === 'primary' && 'text-primary-main border-primary-main aria-checked:bg-primary-selected/10',
        variant === 'text' && color === 'secondary' && 'text-secondary-main border-secondary-main aria-checked:bg-secondary-selected/10',
        variant === 'text' && color === 'neutral' && 'text-text-main border-text-main aria-checked:bg-text-secondary/20',
        variant === 'text' && color === 'warning' && 'text-warning-main border-warning-main aria-checked:bg-warning-selected/10',
        variant === 'text' && color === 'error' && 'text-error-main border-error-main aria-checked:bg-error-selected/10',
        size === 'small' && 'px-1.5 py-1.5 text-body-small',
        size === 'medium' && 'px-2 py-1.5 text-body',
        size === 'large' && 'px-3 py-2 text-body-large',
        'transition-all leading-none',
        'disabled:cursor-default disabled:opacity-disabled',
        variant === 'filled' && 'hover:not-disabled:opacity-75',
        variant === 'text' && color === 'primary' && 'hover:not-disabled:bg-primary-main/15 aria-checked:hover:not-disabled:bg-primary-selected/20',
        variant === 'text' && color === 'secondary' && 'hover:not-disabled:bg-secondary-main/15 aria-checked:hover:not-disabled:bg-secondary-selected/20',
        variant === 'text' && color === 'neutral' && 'hover:not-disabled:bg-text-main/10 aria-checked:hover:not-disabled:bg-text-secondary/30',
        variant === 'text' && color === 'warning' && 'hover:not-disabled:bg-warning-main/15 aria-checked:hover:not-disabled:bg-warning-selected/20',
        variant === 'text' && color === 'error' && 'hover:not-disabled:bg-error-main/15 aria-checked:hover:not-disabled:bg-error-selected/20',
        loading && 'pointer-events-none',
        className,
      )}
      disabled={disabled}
      aria-busy={loading}
      {...props}
    >
      {icon && (
        <span
          className={clsx(
            !!children && 'mr-1',
            size === 'small' && 'text-body',
            size === 'medium' && 'text-h4',
            size === 'large' && 'text-h3',
            !children && size === 'small' && '',
            !children && size === 'medium' && '-mx-0.5',
            !children && size === 'large' && '-mx-1',
            'leading-0 transition-opacity',
            loading && 'opacity-0',
          )}
        >
          {icon}
        </span>
      )}
      <div className={clsx('transition-opacity duration-200', !loading && 'opacity-100', loading && 'opacity-0')}>{children}</div>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <CircularProgress
          size={size}
          show={loading}
          color={variant === 'filled' ? 'contrasted' : 'neutral'}
        />
      </div>
    </Comp>
  )
}

export default Button
