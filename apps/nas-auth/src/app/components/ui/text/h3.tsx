import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type H3Props = BaseHtmlProps<'h3'>

const H3 = ({ children, className, ...props }: H3Props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <h3 className={clsx('text-2xl font-thin', className)} {...props}>{children}</h3>
)

export default H3
