import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type H2Props = BaseHtmlProps<'h1'>

const H2 = ({ children, className, ...props }: H2Props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <h2 className={clsx('text-3xl font-thin', className)} {...props}>{children}</h2>
)

export default H2
