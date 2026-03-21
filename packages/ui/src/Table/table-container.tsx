import { type ComponentProps } from 'react'
import { clsx } from '../utils'

export type TableContainerProps = ComponentProps<'div'>

const TableContainer = ({ className, ...props }: TableContainerProps) => (
  <div
    {...props}
    className={clsx(
      'w-full overflow-x-auto',
      className,
    )}
  />
)

export default TableContainer
