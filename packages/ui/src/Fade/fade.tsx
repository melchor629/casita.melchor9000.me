import type { ElementType } from 'react'
import Transition, { type TransitionImplementationBaseProps } from '../Transition'
import { clsx, type OverridableComponent, type OverridableComponentProps } from '../utils'

type FadeMap = {
  props: TransitionImplementationBaseProps;
  defaultComponent: 'div';
}

export type FadeProps<BaseElement extends ElementType = FadeMap['defaultComponent']> =
  OverridableComponentProps<FadeMap, BaseElement>

/**
 * Element that hides and shows its content using a fade transition.
 */
const Fade: OverridableComponent<FadeMap> = ({ className, ...props }: FadeProps) => (
  <Transition
    {...props}
    className={clsx('opacity-100', 'aria-hidden:opacity-0', className)}
    transitionPropertyName="opacity"
    keepInteractiveWhenHidden
  />
)

export default Fade
