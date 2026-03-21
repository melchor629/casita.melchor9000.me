import { type ComponentProps } from 'react'
import { clsx } from '../utils'
import { TableScopeContext } from './table-context'

export type TableHeadProps = ComponentProps<'thead'>

const TableHead = ({ className, ...props }: TableHeadProps) => (
  <TableScopeContext value="head">
    <thead
      {...props}
      className={clsx(
        className,
      )}
    />
  </TableScopeContext>
)

export default TableHead
