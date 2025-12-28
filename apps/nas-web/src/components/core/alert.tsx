import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Error, Info } from '../icons'
import { makeStyles, type MakeStylesProps } from './utils'

const alertStyles = makeStyles({
  slots: {
    base: 'flex gap-2 px-2 py-1 border rounded-sm',
    text: 'text-body break-all',
    title: 'text-h4',
    icon: 'text-h3 mt-0.5',
  },
  variants: {
    severity: {
      default: {
        base: 'text-text-main bg-text-contrasted/60 border-text-secondary',
      },
      error: {
        base: 'text-error-selected bg-error-main/20 border-error-selected',
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
    // eslint-disable-next-line react/jsx-props-no-spreading
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
