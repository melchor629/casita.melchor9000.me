import type { ComponentPropsWithRef, ElementType, JSX } from 'react'

export { clsx } from 'clsx/lite'

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

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
  OverrideProps<TypeMap, ElementType> & { component?: C }
