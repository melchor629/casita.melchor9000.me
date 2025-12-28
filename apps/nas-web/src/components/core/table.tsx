import { createContext, use, type ComponentProps } from 'react'
import { clsx } from './utils'

const TableContext = createContext<{
  hover?: boolean
}>(null!)
const TableScopeContext = createContext<'head' | 'body'>('body')

export const TableContainer = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    className={clsx(
      'w-full overflow-x-auto',
      className,
    )}
  />
)

type TableProps = Readonly<ComponentProps<'table'> & {
  hover?: boolean
}>

export const Table = ({ className, hover, ...props }: TableProps) => (
  <TableContext value={{ hover }}>
    <table
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx(
        'table-auto',
        className,
      )}
    />
  </TableContext>
)

export const TableHead = ({ className, ...props }: ComponentProps<'thead'>) => (
  <TableScopeContext value="head">
    <thead
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx(
        className,
      )}
    />
  </TableScopeContext>
)

export const TableBody = ({ className, ...props }: ComponentProps<'tbody'>) => (
  <TableScopeContext value="body">
    <tbody
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx(
        className,
      )}
    />
  </TableScopeContext>
)

export const TableRow = ({ className, ...props }: ComponentProps<'tr'>) => {
  const { hover } = use(TableContext)
  const scope = use(TableScopeContext)
  return (
    <tr
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx(
        'transition-colors duration-75',
        hover && scope === 'body' && 'hover:bg-text-main/20',
        className,
      )}
    />
  )
}

export const TableCell = ({ className, ...props }: ComponentProps<'td'>) => (
  <td
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    className={clsx(
      'px-1.5 py-1 text-body text-text-main',
      'first:pl-2.5 first:rounded-l-sm last:pr-2.5 last:rounded-r-sm',
      className,
    )}
  />
)

export const TableHeaderCell = ({ className, ...props }: ComponentProps<'th'>) => {
  const scope = use(TableScopeContext)
  return (
    <th
      scope={scope === 'head' ? 'col' : 'row'}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx(
        'px-1.5 font-light text-text-secondary text-start',
        'first:pl-2.5 first:rounded-l-sm last:pr-2.5 last:rounded-r-sm',
        scope === 'head' && 'text-body-small py-0.5',
        scope === 'body' && 'text-body py-1',
        className,
      )}
    />
  )
}
