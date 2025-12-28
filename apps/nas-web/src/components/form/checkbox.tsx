import type { ComponentProps, FC, FunctionComponent } from 'react'
import { clsx } from '../core/utils'

interface CheckboxProps extends ComponentProps<'input'> {
  readonly className?: string
  readonly id?: string
}

const CheckboxInput = ({ className, ...props }: ComponentProps<'input'>) => (
  <input
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    className={clsx(
      'w-[1em] h-[1em] rounded-sm',
      'appearance-none border border-text-secondary bg-transparent',
      'hover:not-checked:border-text-main',
      'checked:border-primary-selected checked:bg-primary-main checked:bg-(image:--svg-check)',
      'focus:outline-2 outline-text-secondary/50 checked:outline-primary-selected/30',
      'transition-colors',
      className,
    )}
  />
)

const SwitchInput = ({ className, ...props }: ComponentProps<'input'>) => (
  <input
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    className={clsx(
      'w-[2em] h-[1em] rounded-full relative',
      'appearance-none border border-text-secondary bg-transparent',
      'align-middle cursor-pointer',
      'hover:not-checked:border-text-main',
      'checked:border-primary-selected checked:bg-primary-main',
      'focus:outline-2 outline-text-secondary/50 checked:outline-primary-selected/30',
      'transition-colors',

      'after:inline-block after:w-3 after:h-3 after:mb-px after:translate-x-0.5 after:-translate-y-1',
      'after:rounded-full after:content-[\' \'] after:bg-white after:shadow-sm',
      'after:transition-transform',
      'hover:after:scale-90',
      'checked:after:translate-x-[1em]',

      className,
    )}
  />
)

const CheckboxImpl: FunctionComponent<CheckboxProps & { readonly component: FC<ComponentProps<'input'>> }> = ({
  children,
  className,
  component: Input,
  id,
  ...props
}) => (
  <div
    className={clsx(
      'inline-block',
      className,
    )}
  >
    <Input
      {...props}
      type="checkbox"
      id={id}
    />
    <label className="ml-1 text-base select-none" htmlFor={id}>{children}</label>
  </div>
)

export function Checkbox(props: CheckboxProps) {
  return <CheckboxImpl {...props} component={CheckboxInput} />
}

export function Switch(props: CheckboxProps) {
  return <CheckboxImpl {...props} component={SwitchInput} />
}
