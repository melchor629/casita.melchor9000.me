import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Error, Info } from '../icons'
import { makeStyles, type MakeStylesProps } from '../utils'

const alertStyles = makeStyles({
  slots: {
    base: 'flex gap-2 px-4 py-2 border rounded-md',
    text: 'text-body break-all text-text-secondary',
    title: 'text-h4 font-medium',
    icon: 'text-h3 mt-0.5 -ml-1.5',
  },
  variants: {
    severity: {
      default: {
        base: 'text-text-main bg-text-contrasted/60 border-text-secondary',
      },
      error: {
        base: 'text-error-selected bg-error-main/15 border-error-selected',
      },
    },
  },
  defaultVariants: {
    severity: 'default',
  },
})

export type AlertProps = Readonly<Omit<ComponentPropsWithRef<'div'>, 'title'> & MakeStylesProps<typeof alertStyles> & {
  title: ReactNode
}>

export default function Alert({ children, severity = 'default', title: titleElement, ...props }: AlertProps) {
  const { base, icon, text, title } = alertStyles({ severity })

  return (
    <div {...props} role="alert" className={base(props)}>
      {severity === 'default' && <Info className={icon()} />}
      {severity === 'error' && <Error className={icon()} />}
      <div>
        <h4 className={title()}>{titleElement}</h4>
        <p className={text()}>{children}</p>
      </div>
    </div>
  )
}
