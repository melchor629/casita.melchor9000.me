import type { ComponentProps } from 'react'
import Text from '../Text'
import { clsx } from '../utils'

export type FormControlHelperTextProps = Readonly<Omit<ComponentProps<'div'>, 'color'>>

/**
 * Text to render inside a form control at the bottom after a control. Serves as
 * a helping text to describe what the form control does, or to show validation
 * errors.
 */
export default function FormControlHelperText({
  children,
  className,
  ...props
}: FormControlHelperTextProps) {
  return (
    <Text
      component="div"
      size="bodySmall"
      color="inherit"
      className={clsx(
        'mt-1',
        'text-text-secondary group-[.error]/form-control:text-error-main',
        'group-has-disabled/form-control:opacity-disabled',
        'transition-all',
      )}
      {...props}
    >
      {children}
    </Text>
  )
}
