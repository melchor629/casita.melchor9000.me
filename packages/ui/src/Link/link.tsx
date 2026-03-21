import type { ElementType } from 'react'
import { clsx, type OverridableComponent, type OverridableComponentProps } from '../utils'

type LinkTypeMap = {
  props: {
    underline?: 'never' | 'hover' | 'always' | true
  }
  defaultComponent: 'a'
}

export type LinkProps<C extends ElementType = LinkTypeMap['defaultComponent']> = OverridableComponentProps<LinkTypeMap, C>

const Link: OverridableComponent<LinkTypeMap> = ({
  className,
  component: Comp = 'a',
  underline = 'never',
  ...props
}: LinkProps) => {
  return (
    <Comp
      className={clsx(
        'text-primary-main',
        underline === 'never' && 'no-underline',
        underline === 'hover' && 'hover:underline',
        (underline === 'always' || underline === true) && 'underline',
        'transition-colors',
        'hover:text-primary-selected',
        className,
      )}
      {...props}
    />
  )
}

export default Link
