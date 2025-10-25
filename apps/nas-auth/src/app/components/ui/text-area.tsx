import { clsx } from 'clsx'
import type { BaseHtmlProps } from './types'

type TextAreaProps = BaseHtmlProps<'textarea'>

const TextArea = ({ children, className, ...props }: TextAreaProps) => (
  <textarea
    className={clsx(
      'text-slate-900 dark:text-slate-100',
      'bg-transparent',
      'hover:bg-gray-100/90 dark:hover:bg-gray-900/25',
      'focus:bg-gray-100/90 dark:focus:bg-gray-900/25',
      'border border-slate-800 dark:border-slate-200 rounded-sm',
      'px-2 py-1',
      className,
    )}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {children}
  </textarea>
)

export default TextArea
