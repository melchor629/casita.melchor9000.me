import { makeStyles } from '@melchor629/ui/utils'
import { memo } from 'react'

const dotsStyles = makeStyles({
  slots: {
    base: 'mx-auto my-7 flex justify-center gap-3',
    dot: 'w-7 h-7 rounded-full animate-dots-pulse bg-current',
  },
  variants: {
    n: {
      1: {
        dot: 'animation-delay-[-160ms,-5.4s]',
      },
      3: {
        dot: 'animation-delay-[160ms,5.4s]',
      },
    },
  },
})

const Dots = memo(({ className }: { readonly className?: string }) => {
  const { base, dot } = dotsStyles({ className })
  return (
    <div className={base()}>
      <div className={dot({ n: 1 })} />
      <div className={dot()} />
      <div className={dot({ n: 3 })} />
    </div>
  )
})

Dots.displayName = 'Dots'

export default Dots
