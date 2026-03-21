import type { ComponentProps } from 'react'
import { clsx } from '../utils'

export type TableCellProps = ComponentProps<'td'>

const TableCell = ({ className, ...props }: TableCellProps) => (
  <td
    {...props}
    className={clsx(
      'px-1.5 py-1 text-body text-text-main',
      'first:pl-2.5 first:rounded-l-sm last:pr-2.5 last:rounded-r-sm',
      className,
    )}
  />
)

export default TableCell
