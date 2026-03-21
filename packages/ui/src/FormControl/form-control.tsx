import type { ComponentProps } from 'react'
import FormControlHelperText from '../FormControlHelperText'
import FormControlLabel from '../FormControlLabel'
import { makeStyles } from '../utils'

export type FormControlProps = Readonly<ComponentProps<'div'> & {
  fullWidth?: boolean
  label?: string
  htmlFor?: string
  helperText?: string
  error?: boolean | string
}>

const createStyles = makeStyles({
  base: 'max-w-full group/form-control',
  variants: {
    fullWidth: {
      true: 'w-full',
    },
    error: {
      true: 'error',
    },
  },
})

export default function FormControl({
  children,
  className,
  error,
  fullWidth,
  helperText,
  htmlFor,
  label,
  ...props
}: FormControlProps) {
  const styles = createStyles({ className, error: !!error, fullWidth })
  return (
    <div {...props} className={styles}>
      {label && htmlFor && <FormControlLabel htmlFor={htmlFor}>{label}</FormControlLabel>}
      {children}
      {(helperText || !!error) && (
        <FormControlHelperText>
          {error && typeof error === 'string' ? error : helperText}
        </FormControlHelperText>
      )}
    </div>
  )
}
