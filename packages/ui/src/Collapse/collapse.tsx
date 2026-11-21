import type { ElementType } from 'react'
import Transition, { type TransitionImplementationBaseProps } from '../Transition'
import { clsx, type OverridableComponent, type OverridableComponentProps } from '../utils'

type CollapseMap = {
  props: TransitionImplementationBaseProps & {
    /**
     * Sets a hidden size different from the default `0px`. Used to implement other techniques of
     * collapsing. Note that when this is filled, the `unmounWhenHidden` will be forced to be
     * false.
     */
    minSize?: string
  }
  defaultComponent: 'div'
}

export type CollapseProps<BaseElement extends ElementType = CollapseMap['defaultComponent']> =
  OverridableComponentProps<CollapseMap, BaseElement>

/**
 * Element that collapses or expands its contents based on the `show` prop. When expanding, the
 * contents will open from 0 height up to the contents height. The contents will not render a
 * scrollbar as it is disabled always. The closed size can be overriden with `minSize` property.
 * Note that when `minSize` is set, `unmountWhenHidden` will be forced to be `false` always.
 */
const Collapse: OverridableComponent<CollapseMap> = ({
  className,
  minSize,
  ...props
}: CollapseProps) => (
  <Transition
    {...props}
    data-min-size={minSize}
    className={clsx(
      'overflow-hidden h-max',
      minSize ? 'aria-hidden:h-[attr(data-min-size_type(<length>))]' : 'aria-hidden:h-0',
      className,
    )}
    keepInteractiveWhenHidden={!!minSize}
    transitionPropertyName="height"
  />
)

export default Collapse
