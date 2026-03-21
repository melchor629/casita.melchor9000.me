import { type ComponentProps } from 'react'
import { clsx } from '../utils'
import { TableScopeContext } from './table-context'

export type TableBodyProps = ComponentProps<'tbody'>

const TableBody = ({ className, ...props }: TableBodyProps) => (
  <TableScopeContext value="body">
    <tbody
      {...props}
      className={clsx(
        className,
      )}
    />
  </TableScopeContext>
)

export default TableBody
