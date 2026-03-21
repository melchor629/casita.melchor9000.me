import type { ComponentPropsWithRef } from 'react'
import { clsx } from '../utils'

export type IconProps = Readonly<Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  size?: 'inherit' | 'small' | 'medium' | 'large'
  icon: string
} & (
  | {
    type: 'material-symbols' | 'fontawesome-regular'
    variant?: 'filled' | 'outlined'
  }
  | {
    type: 'fontawesome-brands'
    variant?: undefined
  }
)>

export default function Icon({
  className,
  icon,
  role,
  size = 'inherit',
  title,
  type,
  variant = 'filled',
  ...props
}: IconProps) {
  return (
    <span
      {...props}
      title={title}
      role={role ?? (title ? 'img' : undefined)}
      className={clsx(
        type === 'material-symbols' && 'md-icon',
        type === 'material-symbols' && variant === 'filled' && 'md-icon-filled',
        type === 'fontawesome-regular' && variant === 'outlined' && 'fa-regular',
        type === 'fontawesome-regular' && variant === 'filled' && 'fa-solid',
        type === 'fontawesome-brands' && 'fa-brands',
        size === 'small' && 'text-body-large',
        size === 'medium' && 'text-h4',
        size === 'large' && 'text-h3',
        className,
      )}
    >
      {icon}
    </span>
  )
}
