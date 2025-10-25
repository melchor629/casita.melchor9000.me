import { clsx } from 'clsx'
import type { BaseHtmlProps } from '../types'

type TableProps = BaseHtmlProps<'table', {
  containerClassName?: string
}>

const Table = ({
  children,
  className,
  containerClassName,
  ...props
}: TableProps) => (
  <div className={clsx('w-full overflow-x-auto', containerClassName)}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <table className={clsx('min-w-full table-auto whitespace-nowrap', className)} {...props}>
      {children}
    </table>
  </div>
)

export default Table
