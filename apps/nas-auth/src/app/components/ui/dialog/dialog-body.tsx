import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type DialogBodyProps = BaseHtmlProps<'main'>

const DialogBody = ({ children, className, ...props }: DialogBodyProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <main className={clsx('px-2', className)} {...props}>
    {children}
  </main>
)

export default DialogBody
