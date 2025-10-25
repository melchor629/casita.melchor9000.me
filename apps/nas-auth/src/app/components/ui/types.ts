import type { ComponentProps, JSX, VNode } from 'preact'
import type { ElementType } from 'preact/compat'

type OverridenComponentProps<T extends ElementType, BaseProps extends object> =
  T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : Omit<ComponentProps<T>, keyof BaseProps>

export type OverridableComponent<
  Props extends object,
  DefaultComponent extends ElementType,
  RequiredProps = never,
> = {
  <const C extends ElementType<RequiredProps>>(props: Readonly<{ as: C } & Props & OverridenComponentProps<C, Props>>): VNode
  (props: Readonly<Props & OverridenComponentProps<DefaultComponent, Props>>): VNode
}

export type BaseHtmlProps<T extends keyof JSX.IntrinsicElements, CustomProps extends object = object> = Readonly<
  & JSX.IntrinsicElements[T]
  & CustomProps
>
