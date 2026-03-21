import { use, type ComponentProps } from 'react'
import { clsx } from '../utils'
import { TableScopeContext } from './table-context'

export type TableHeadCellProps = Readonly<ComponentProps<'th'> & {
  /**
   * Try to shrink all cells in this column.
   */
  shrink?: boolean
}>

const TableHeadCell = ({ className, shrink, ...props }: TableHeadCellProps) => {
  const scope = use(TableScopeContext)
  return (
    <th
      scope={scope === 'head' ? 'col' : 'row'}
      {...props}
      className={clsx(
        'px-1.5 font-light text-text-secondary text-start',
        'first:pl-2.5 first:rounded-l-sm last:pr-2.5 last:rounded-r-sm',
        scope === 'head' && 'text-body-small py-0.5',
        scope === 'body' && 'text-body-small py-1',
        scope === 'head' && shrink && 'whitespace-nowrap w-px',
        className,
      )}
    />
  )
}

export default TableHeadCell
