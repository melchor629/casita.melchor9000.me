import type { ComponentProps } from 'react'
import { clsx } from '../utils'

export type TableCellProps = ComponentProps<'td'> & Readonly<{
  noWrap?: boolean
}>

const TableCell = ({ className, noWrap, ...props }: TableCellProps) => (
  <td
    {...props}
    className={clsx(
      'px-1.5 py-1 text-body text-text-main',
      'first:pl-2.5 first:rounded-l-sm last:pr-2.5 last:rounded-r-sm',
      noWrap && 'whitespace-nowrap',
      className,
    )}
  />
)

export default TableCell
