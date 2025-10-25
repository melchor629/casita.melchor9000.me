import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type TableRowProps = BaseHtmlProps<'tr', { hover?: boolean }>

const TableRow = ({
  children,
  className,
  hover,
  ...props
}: TableRowProps) => (
  <tr
    className={clsx(
      hover && 'hover:bg-slate-900/10 dark:hover:bg-slate-100/10',
      className,
    )}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {children}
  </tr>
)

export default TableRow
