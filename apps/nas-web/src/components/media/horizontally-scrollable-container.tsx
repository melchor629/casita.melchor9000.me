import type { ComponentProps } from 'react'

const HorizontallyScrollableContainer = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    className={`flex gap-6 px-6 py-6 -mx-3 overflow-x-auto scroll-pl-6 snap-x snap-proximity *:snap-start ${className || ''}`.trim()}
    role="grid"
  />
)

export default HorizontallyScrollableContainer
