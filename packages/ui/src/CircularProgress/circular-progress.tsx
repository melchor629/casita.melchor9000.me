import { useState, type Ref } from 'react'
import { makeStyles, type MakeStylesProps } from '../utils'

export type CircularProgressProps = Readonly<MakeStylesProps<typeof circularProgressStyles> & {
  ref?: Ref<SVGSVGElement>
  className?: string
  percentage?: number
}>

const circularProgressStyles = makeStyles({
  slots: {
    base: 'inline transition-all duration-200',
    circle: 'opacity-30',
    path: 'opacity-95 origin-center transition-all duration-200 rotate-0',
  },
  variants: {
    show: {
      false: {
        base: 'opacity-0',
      },
      true: {
        base: 'opacity-100',
      },
    },
    size: {
      small: {
        base: 'size-4',
      },
      medium: {
        base: 'size-5',
      },
      large: {
        base: 'size-6',
      },
      inherit: {
        base: 'size-[1em]',
      },
    },
    color: {
      inherit: {},
      primary: {
        base: 'text-primary-main',
      },
      secondary: {
        base: 'text-secondary-main',
      },
      error: {
        base: 'text-error-main',
      },
      neutral: {
        base: 'text-text-main',
      },
      contrasted: {
        base: 'text-text-contrasted',
      },
    },
    variant: {
      indeterminate: {
        path: 'animate-spin',
      },
      determinate: {},
    },
  },
  defaultVariants: {
    size: 'medium',
    show: true,
    color: 'neutral',
    variant: 'indeterminate',
  },
})

export default function CircularProgress({
  className,
  color,
  percentage,
  show,
  size,
  variant = 'indeterminate',
  ...props
}: CircularProgressProps) {
  const [pathRef, setPathRef] = useState<SVGPathElement | null>(null)
  const [processedVariant, setProcessedVariant] = useState(variant)
  const styles = circularProgressStyles({ color, show, size, variant })
  percentage = variant === 'indeterminate' ? 33 : percentage ?? 0

  if (variant !== processedVariant) {
    if (variant === 'determinate') {
      const transform = pathRef?.computedStyleMap().get('transform')
      const rotation = (transform instanceof CSSTransformValue ? transform : null)
        ?.values()
        .find((v) => v instanceof CSSRotate)
        ?.angle
        ?.to('deg')
        .value
      requestAnimationFrame(() =>
        pathRef?.animate([
          { transform: `rotate(${rotation ?? 0}deg)` },
          { transform: 'rotate(360deg)' },
        ], { duration: 200, easing: 'ease-out' }),
      )
    }
    setProcessedVariant(variant)
  }

  return (
    <svg
      {...props}
      className={styles.base({ className })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="progressbar"
      aria-valuenow={variant === 'determinate' ? percentage : undefined}
      aria-valuemin={variant === 'determinate' ? 0 : undefined}
      aria-valuemax={variant === 'determinate' ? 100 : undefined}
    >
      <circle
        className={styles.circle()}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        ref={setPathRef}
        className={styles.path()}
        d="M 12 12  m 10, 0  a 10,10 0 1,0 -20,0  a 10,10 0 1,0  20,0"
        pathLength="100"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDashoffset={percentage - 25.3}
        strokeDasharray={`${percentage},${100 - percentage}`}
      />
    </svg>
  )
}
