import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type TableHeadProps = BaseHtmlProps<'thead'>

const TableHead = ({ children, className, ...props }: TableHeadProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <thead className={clsx('bg-slate-900/20 dark:bg-slate-100/20', className)} {...props}>
    {children}
  </thead>
)

export default TableHead
