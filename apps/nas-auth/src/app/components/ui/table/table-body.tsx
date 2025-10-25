import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type TableBodyProps = BaseHtmlProps<'tbody'>

const TableBody = ({ children, className, ...props }: TableBodyProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <tbody className={clsx('', className)} {...props}>{children}</tbody>
)

export default TableBody
