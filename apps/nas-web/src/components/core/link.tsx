import type { ElementType } from 'react'
import { clsx, type OverridableComponent, type OverridableComponentProps } from './utils'

type LinkTypeMap = {
  props: {
    variant?: 'normal'
    underline?: 'never' | 'hover' | 'always'
  }
  defaultComponent: 'a'
}

export type LinkProps<C extends ElementType = LinkTypeMap['defaultComponent']> = OverridableComponentProps<LinkTypeMap, C>

const Link: OverridableComponent<LinkTypeMap> = ({
  className,
  component: Comp = 'a',
  underline = 'never',
  variant = 'normal',
  ...props
}: LinkProps) => {
  return (
    <Comp
      className={clsx(
        'text-primary-main',
        underline === 'never' && 'no-underline',
        underline === 'hover' && 'hover:underline',
        underline === 'always' && 'underline',
        'transition-opacity',
        'hover:opacity-75',
        className,
      )}
      {...props}
    />
  )
}

export default Link
