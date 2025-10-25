import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type TableHeadColumnProps = BaseHtmlProps<'th', { shrink?: boolean }>

const TableHeadColumn = ({ children, className, shrink, ...props }: TableHeadColumnProps) => (
  <th
    className={clsx(
      'text-start px-2 py-1 font-normal text-sm opacity-90',
      shrink && 'whitespace-nowrap w-px',
      className,
    )}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {children}
  </th>
)

export default TableHeadColumn
