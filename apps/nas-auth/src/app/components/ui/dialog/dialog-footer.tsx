import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type DialogFooterProps = BaseHtmlProps<'footer'>

const DialogFooter = ({ children, className, ...props }: DialogFooterProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <footer className={clsx(className, 'mx-2 mt-4 mb-2')} {...props}>
    {children}
  </footer>
)

export default DialogFooter
