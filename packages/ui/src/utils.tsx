import type { ClassValue } from 'clsx/lite'
import { type ComponentPropsWithRef, type ElementType, type JSX } from 'react'
import { type TVCompoundVariants, type TVDefaultVariants, tv, type TVVariants, type VariantProps, type TVReturnType } from 'tailwind-variants/lite'

export { clsx } from 'clsx/lite'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

interface OverridableTypeMap {
  props: object
  defaultComponent: ElementType
}

export type OverridableComponent<TypeMap extends OverridableTypeMap> = {
  <Component extends ElementType>(
    props: {
      /**
       * Uses this component as base component to render.
       */
      readonly component: Component
    } & OverrideProps<TypeMap, Component>,
  ): JSX.Element | null
  (props: DefaultProps<TypeMap>): JSX.Element | null
}

type CommonProps = {
  /**
   * Adds additional classes to the element.
   */
  className?: string
}

type OverrideProps<TypeMap extends OverridableTypeMap, Component extends ElementType> =
  & TypeMap['props']
  & CommonProps
  & DistributiveOmit<ComponentPropsWithRef<Component>, keyof TypeMap['props'] | keyof CommonProps>

type DefaultProps<TypeMap extends OverridableTypeMap> = OverrideProps<TypeMap, TypeMap['defaultComponent']>

export type OverridableComponentProps<TypeMap extends OverridableTypeMap, C extends ElementType = TypeMap['defaultComponent']> =
  OverrideProps<TypeMap, C> & {
    /**
     * Replaces the base component to other. This component will now receive
     * the props from the override components and types will change to reflect
     * that.
     */
    component?: C
  }

export function styled<const Comp extends ElementType>(
  Component: Comp,
  name: string,
) {
  return function <
    V extends TVVariants<undefined, B, EV>,
    CV extends TVCompoundVariants<V, undefined, B, EV, object>,
    DV extends TVDefaultVariants<V, undefined, EV, object>,
    B extends ClassValue = undefined,
    // @ts-expect-error asdf
    E extends TVReturnType = TVReturnType<
      V,
      undefined,
      B,
      // @ts-expect-error asdf
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      EV extends undefined ? {} : EV,
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {}
    >,
    EV extends TVVariants<object, B, E['variants'], object> = E['variants'],
  >(options: Parameters<typeof tv<V, CV, DV, B, undefined, E, EV, object>>[0]) {
    const styles = tv(options)
    const comp = (props: ComponentPropsWithRef<Comp> & VariantProps<TVReturnType<V, undefined, B, EV, object, E>>) => {
      const className = styles(props)
      // @ts-expect-error ssshhh!
      return <Component {...props} className={className} />
    }
    comp.displayName = name
    return comp
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MakeStylesProps<Component extends (...args: any) => any> = VariantProps<Component>

export const makeStyles = tv
