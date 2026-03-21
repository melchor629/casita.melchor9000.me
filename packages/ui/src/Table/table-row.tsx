import { Children, use, type ComponentProps } from 'react'
import { clsx } from '../utils'
import { TableContext, TableScopeContext } from './table-context'
import TableHeadCell from './table-head-cell'

export type TableRowProps = ComponentProps<'tr'>

const TableRow = ({ className, ...props }: TableRowProps) => {
  const { hover } = use(TableContext)
  const scope = use(TableScopeContext)
  const hasCellHeader = Children.toArray(props.children)
    .map((d) => d && typeof d === 'object' && 'type' in d ? d.type : null)
    .find((t) => t === 'th' || t === TableHeadCell) != null
  return (
    <tr
      {...props}
      className={clsx(
        'transition-colors duration-75',
        hover && scope === 'body' && !hasCellHeader && 'hover:bg-text-main/20',
        className,
      )}
    />
  )
}

export default TableRow
