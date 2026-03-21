import { ButtonGroupContext } from '../Button/button-group-context'
import { clsx } from '../utils'

export type ButtonGroupProps = Readonly<
  & React.ComponentProps<'div'>
  & React.ComponentProps<typeof ButtonGroupContext>['value']
>

export default function ButtonGroup({ children, className, color, size, variant, ...props }: ButtonGroupProps) {
  return (
    <div
      {...props}
      role="group"
      className={clsx(
        'inline-flex *:rounded-none *:first:rounded-l-md *:last:rounded-r-md *:not-last:border-r',
        className,
      )}
    >
      <ButtonGroupContext value={{ color, size, variant }}>
        {children}
      </ButtonGroupContext>
    </div>
  )
}
