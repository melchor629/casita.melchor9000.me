import { clsx } from './utils'

export type ButtonGroupProps = Readonly<React.ComponentProps<'div'>>

export default function ButtonGroup({ children, className, ...props }: ButtonGroupProps) {
  return (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      role="group"
      className={clsx(
        'inline-flex *:rounded-none *:first:rounded-l-md *:last:rounded-r-md *:not-last:border-r',
        className,
      )}
    >
      {children}
    </div>
  )
}
