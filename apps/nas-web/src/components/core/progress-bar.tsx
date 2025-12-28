import type { ComponentProps } from 'react'
import { clsx } from './utils'

export type ProgressBarProps = Readonly<ComponentProps<'div'> & {
  min?: number
  max?: number
  value?: number
  size?: 'small' | 'medium' | 'large'
}>

const ProgressBar = ({ className, max = 100, min = 0, size = 'medium', value, ...props }: ProgressBarProps) => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    className={clsx(
      'w-full bg-text-main/30',
      size === 'small' && 'h-2 rounded-sm',
      size === 'medium' && 'h-4 rounded-md',
      size === 'large' && 'h-6 rounded-lg',
    )}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
  >
    <div
      className={clsx(
        'w-(--progress) h-full bg-primary-main transition-all',
        size === 'small' && 'rounded-sm',
        size === 'medium' && 'rounded-md',
        size === 'large' && 'rounded-lg',
      )}
      // @ts-expect-error does not understand creating a css var
      style={{ '--progress': `${((value ?? min) - min) / (max - min) * 100}%` }}
    />
  </div>
)

export default ProgressBar
