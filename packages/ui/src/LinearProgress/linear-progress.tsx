import { useState, type ComponentProps } from 'react'
import { makeStyles, type MakeStylesProps } from '../utils'

export type LinearProgressProps = Readonly<ComponentProps<'div'> & {
  min?: number
  max?: number
  value?: number
} & MakeStylesProps<typeof styles>>

const styles = makeStyles({
  slots: {
    base: 'w-full bg-text-main/20 dark:bg-text-main/30 overflow-hidden @container/linear-progress',
    bar: 'h-full transition-all duration-200',
  },
  variants: {
    size: {
      small: {
        base: 'h-1 rounded-sm',
        bar: 'rounded-sm',
      },
      medium: {
        base: 'h-2 rounded-md',
        bar: 'rounded-md',
      },
      large: {
        base: 'h-4 rounded-lg',
        bar: 'rounded-lg',
      },
    },
    color: {
      primary: {
        bar: 'bg-primary-main',
      },
      secondary: {
        bar: 'bg-secondary-main',
      },
      neutral: {
        bar: 'bg-text-main',
      },
      error: {
        bar: 'bg-error-main',
      },
    },
    variant: {
      indeterminate: {
        bar: 'w-[25%] animate-[progress-bar-indeterminate_5s_ease-in-out_infinite]',
      },
      determinate: {
        bar: 'w-[attr(data-progress_%)]',
      },
    },
  },
})

const LinearProgress = ({
  className,
  color = 'neutral',
  max = 100,
  min = 0,
  size = 'medium',
  value,
  variant = 'indeterminate',
  ...props
}: LinearProgressProps) => {
  const [divRef, setDivRef] = useState<HTMLDivElement | null>(null)
  const [processedVariant, setProcessedVariant] = useState(variant)
  const { bar, base } = styles({ color, size, variant })

  if (variant !== processedVariant) {
    if (variant === 'determinate') {
      const transform = divRef?.computedStyleMap().get('transform')
      const translateValue = (transform instanceof CSSTransformValue ? transform : null)
        ?.values()
        .find((v) => v instanceof CSSTranslate)
        ?.x
      const [transPerc, transPx] = (translateValue instanceof CSSMathSum ? translateValue : null)
        ?.values
        .values().map((v) => (v as CSSUnitValue).value)
        ?? []
      requestAnimationFrame(() =>
        divRef?.animate([
          { transform: `translateX(calc(${transPerc ?? 0}% + ${transPx ?? 0}px))` },
          { transform: 'translateX(0px)' },
        ], { duration: 200, easing: 'ease-out' }),
      )
    }
    setProcessedVariant(variant)
  }

  return (
    <div
      {...props}
      className={base({ className })}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
    >
      <div
        ref={setDivRef}
        className={bar()}
        data-progress={Math.max(min, Math.min(((value ?? min) - min) / (max - min) * 100, max))}
      />
    </div>
  )
}

export default LinearProgress
