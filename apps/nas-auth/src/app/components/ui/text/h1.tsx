import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type H1Props = BaseHtmlProps<'h1'>

const H1 = ({ children, className, ...props }: H1Props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <h1 className={clsx('text-4xl font-thin', className)} {...props}>{children}</h1>
)

export default H1
