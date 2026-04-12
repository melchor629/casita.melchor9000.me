import type { ComponentPropsWithRef, ReactNode } from 'react'
import { CheckCircle, Error, Info, Warning } from '../icons'
import { makeStyles, type MakeStylesProps } from '../utils'

const alertStyles = makeStyles({
  slots: {
    base: 'flex gap-2 px-4 py-1.5 border-2 rounded-lg',
    text: 'text-body break-all text-text-secondary',
    title: 'text-h4 font-medium',
    icon: 'text-h3 mt-0.5 -ml-1.5',
  },
  variants: {
    severity: {
      default: {
        base: 'text-text-main bg-text-contrasted border-text-secondary',
      },
      warning: {
        base: 'text-warning-main bg-warning-alert border-warning-main',
      },
      error: {
        base: 'text-error-main bg-error-alert border-error-main',
      },
      success: {
        base: 'text-success-main bg-success-alert border-success-main',
      },
    },
  },
  defaultVariants: {
    severity: 'default',
  },
})

/**
 * Props for the Alert component.
 */
export type AlertProps = Readonly<Omit<ComponentPropsWithRef<'div'>, 'title'> & MakeStylesProps<typeof alertStyles> & {
  title: ReactNode
}>

/**
 * A reusable component for displaying important information alerts based on severity.
 */
export default function Alert({ children, severity = 'default', title: titleElement, ...props }: AlertProps) {
  const { base, icon, text, title } = alertStyles({ severity })

  return (
    <div {...props} role="alert" className={base(props)}>
      {severity === 'default' && <Info className={icon()} />}
      {severity === 'error' && <Error className={icon()} />}
      {severity === 'warning' && <Warning className={icon()} />}
      {severity === 'success' && <CheckCircle className={icon()} />}
      <div>
        <h4 className={title()}>{titleElement}</h4>
        <p className={text()}>{children}</p>
      </div>
    </div>
  )
}
