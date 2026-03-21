import type { ComponentProps } from 'react'
import Text from '../Text'
import { makeStyles } from '../utils'

export type FormControlLabelProps = Readonly<Omit<ComponentProps<'label'>, 'color'>>

const createStyles = makeStyles({
  base: `
    block mb-1 select-none
    text-text-main group-[.error]/form-control:text-error-main
    transition-opacity group-has-disabled/form-control:opacity-disabled
    group-has-required/form-control:after:content-['_*']
  `,
})

export default function FormControlLabel({ children, className, ...props }: FormControlLabelProps) {
  const styles = createStyles({ className })
  return (
    <Text component="label" {...props} color="inherit" size="body" weight="medium" className={styles} ellipsize>
      {children}
    </Text>
  )
}
