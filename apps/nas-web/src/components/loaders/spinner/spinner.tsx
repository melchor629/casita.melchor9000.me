import type { Ref } from 'react'
import { makeStyles, type MakeStylesProps } from '@/components/core/utils'

export type SpinnerProps = Readonly<MakeStylesProps<typeof spinnerStyles> & {
  ref?: Ref<HTMLDivElement>
  className?: string
}>

const spinnerStyles = makeStyles({
  base: `
    relative inline-block opacity-0
    rounded-full border-text-main/25 border-t-text-main
    transition-opacity duration-200 animate-spin
  `,
  variants: {
    show: {
      true: 'opacity-100',
    },
    size: {
      sm: 'w-4 h-4 border-3',
      md: 'w-6 h-6 border-4',
      lg: 'w-8 h-8 border-6',
    },
  },
  defaultVariants: {
    size: 'md',
    show: true,
  },
})

export default function Spinner({ className, show, size, ...props }: SpinnerProps) {
  const spinner = spinnerStyles({ show, size, className })
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...props} className={spinner} />
  )
}
