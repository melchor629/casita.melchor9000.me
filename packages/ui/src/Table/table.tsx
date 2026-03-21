import type { ComponentProps } from 'react'
import { clsx } from '../utils'
import { TableContext } from './table-context'

export type TableProps = Readonly<ComponentProps<'table'> & {
  /**
   * Expands the table to use the full width. Must use if the table
   * is inside a `TableContainer`.
   * @default false
   */
  full?: boolean
  /**
   * Hover rows when the mouse is over each.
   * @default false
   */
  hover?: boolean
  /**
   * Disable text wrapping in each cell of the table.
   * @default false
   */
  noWrap?: boolean
}>

/**
 * Renders an HTML table. The table itself does not render any contents,
 * it is required to use the subcomponents `TableHead`, `TableBody`,
 * `TableCell`, `TableCellHeader` and `TableRow`.
 *
 * The table optionally can be surrounded by a `TableContainer` that
 * allows rendering the whole table with a horizontal scroll if it doesn't
 * fit inside the page. For this scenario to properly work, set `full` and
 * `noWrap` to `true` for better experience.
 */
const Table = ({ className, full, hover, noWrap, ...props }: TableProps) => (
  <TableContext value={{ hover }}>
    <table
      {...props}
      className={clsx(
        'table-auto',
        full && 'min-w-full',
        noWrap && 'whitespace-nowrap',
        className,
      )}
    />
  </TableContext>
)

export default Table
