/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ComponentPropsWithRef, type ElementType, type JSX } from 'react'
import { tv, type VariantProps, type TVReturnType, type TVReturnTypeLike, type TVExtendList } from 'tailwind-variants/lite'

export { clsx } from 'clsx/lite'

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

type TVVariantsConstraint = Record<string, Record<string, any>>
type TVVariantsShape = Record<string, Record<string, unknown>> | undefined
type VariantsOfExtend<E> = [E] extends [undefined]
  ? undefined
  : E extends readonly TVReturnTypeLike<any, any>[]
    ? MergedVariantsFromParents<E>
    : ParentVariants<E>

type Simplify<T> = { [K in keyof T]: T[K] } & {}
type ParentVariants<P> = [P] extends [undefined]
  ? undefined
  : P extends TVReturnTypeLike<infer PV extends TVVariantsShape, any>
    ? PV
    : undefined
type MergedVariantsFromParents<T extends readonly TVReturnTypeLike<any, any>[]> = T extends readonly [infer Head, ...infer Rest extends readonly TVReturnTypeLike<any, any>[]]
  ? Rest extends readonly []
    ? ParentVariants<Head>
    : MergeVariantMaps<ParentVariants<Head>, MergedVariantsFromParents<Rest>>
  : undefined
type MergeVariantMaps<Left extends TVVariantsShape, Right extends TVVariantsShape> = [Left] extends [undefined]
  ? Right
  : [Right] extends [undefined]
      ? Left
      : Simplify<{
        [K in keyof Left | keyof Right]: K extends keyof Right ? K extends keyof Left ? MergeVariantOptions<Left[K], Right[K]> : Right[K] : K extends keyof Left ? Left[K] : never;
      }>
type MergeVariantOptions<Left, Right> = [Left, Right] extends [Record<string, unknown>, Record<string, unknown>]
  ? Simplify<Left & Right>
  : Right

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
    V extends TVVariantsConstraint = Record<never, Record<string, any>>,
    DV = object,
    CV extends ReadonlyArray<object> = [],
    B extends ClassNameValue = undefined,
    E extends TVReturnTypeLike<any, any> | TVExtendList | undefined = TVReturnTypeLike<V, undefined>,
    EV extends TVVariantsShape = VariantsOfExtend<E>,
  >(options: Parameters<typeof tv<V, DV, CV, B, undefined, E, EV, undefined>>[0]) {
    const styles = tv<V, DV, CV, B, undefined, E, EV, undefined>(options)
    const comp = (props: ComponentPropsWithRef<Comp> & VariantProps<TVReturnType<V, undefined, B, EV, undefined, E>>) => {
      const className = styles(props)
      // @ts-expect-error ssshhh!
      return <Component {...props} className={className} />
    }
    comp.displayName = name
    return comp
  }
}

export type MakeStylesProps<Component extends (...args: any) => any> = VariantProps<Component>

export const makeStyles = tv
