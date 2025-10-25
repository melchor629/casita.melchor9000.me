import { clsx } from 'clsx'
import type { BaseHtmlProps } from './types'

type InputProps = BaseHtmlProps<'input', {
  className?: string
}>

const Input = ({ className, ...props }: InputProps) => (
  <input
    className={clsx(
      props.type !== 'checkbox' && props.type !== 'radio' && 'block w-full',
      (props.type === 'checkbox' || props.type === 'radio') && 'inline-block',
      'mb-2 px-3 py-1 rounded-sm',
      'text-slate-900 dark:text-slate-100',
      'bg-black/20 dark:bg-white/20',
      'placeholder:text-gray-600 dark:placeholder:text-gray-400',
      'hover:bg-black/35 dark:hover:bg-white/25',
      'outline-none focus-visible:bg-black/35 focus-visible:dark:bg-white/25',
      'disabled:opacity-80',
      'transition',
      className,
    )}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
)

export default Input
