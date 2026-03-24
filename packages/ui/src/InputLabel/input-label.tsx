import type { ComponentProps, ReactElement } from 'react'
import { makeStyles } from '../utils'

export type InputLabelProps = Readonly<ComponentProps<'label'> & {
  input: ReactElement
  margin?: 'none' | 'dense' | 'normal'
}>

const createStyles = makeStyles({
  slots: {
    base: 'inline-flex select-none gap-2 items-center group/input-label',
    input: 'inline',
    text: `
      text-base font-medium
      transition-opacity group-has-disabled/input-label:opacity-disabled
      group-has-required/input-label:after:content-['_*']
    `,
  },
  variants: {
    margin: {
      none: { base: '' },
      dense: { base: 'mt-1' },
      normal: { base: 'mt-2' },
    },
  },
})

export default function InputLabel({ children, className, htmlFor, input, margin = 'none', ...props }: InputLabelProps) {
  const styles = createStyles({ margin })
  return (
    <label {...props} className={styles.base({ className })}>
      {input}
      {children && <div className={styles.text()}>{children}</div>}
    </label>
  )
}
