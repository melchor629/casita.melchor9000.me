import { type ComponentPropsWithRef, type ElementType, type JSX } from 'react'
import { type TVCompoundVariants, type TVDefaultVariants, tv, type TVVariants, type VariantProps, type TVReturnType, type TVReturnTypeLike } from 'tailwind-variants/lite'

export { clsx } from 'clsx/lite'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

type ClassNameValue = ClassNameArray | string | null | undefined | 0 | 0n | false
type ClassNameArray = readonly ClassNameValue[]

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
    CV extends TVCompoundVariants<V, undefined, B, EV, undefined>,
    DV extends TVDefaultVariants<V, undefined, EV, undefined>,
    B extends ClassNameValue = undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    E extends TVReturnTypeLike<any, any> = TVReturnTypeLike<V, undefined>,
    EV extends TVVariants<undefined, B, E['variants'], undefined> = E['variants'],
  >(options: Parameters<typeof tv<V, CV, DV, B, undefined, E, EV, undefined>>[0]) {
    const styles = tv(options)
    const comp = (props: ComponentPropsWithRef<Comp> & VariantProps<TVReturnType<V, undefined, B, EV, undefined, E>>) => {
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
