import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type TableColumnProps = BaseHtmlProps<'td'>

const TableColumn = ({ children, className, ...props }: TableColumnProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <td className={clsx('px-2 py-1', className)} {...props}>
    {children}
  </td>
)

export default TableColumn
