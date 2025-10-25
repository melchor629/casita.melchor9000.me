import { clsx } from 'clsx'
import type { BaseHtmlProps } from './types'

type LabelProps = BaseHtmlProps<'label'>

const Label = ({ children, className, ...props }: LabelProps) => (
  <label
    className={clsx('inline-block pl-1 my-1', className)}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {children}
  </label>
)

export default Label
