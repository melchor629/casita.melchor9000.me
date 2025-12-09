import type { ComponentProps, ElementType, JSX, ReactNode } from 'react'

type OverridenComponentProps<T extends ElementType, BaseProps extends object> =
  T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : Omit<ComponentProps<T>, keyof BaseProps>

export type OverridableComponent<
  Props extends object,
  DefaultComponent extends ElementType,
  RequiredProps = never,
> = {
  <const C extends ElementType<RequiredProps>>(props: Readonly<{ as: C } & Props & OverridenComponentProps<C, Props>>): ReactNode
  (props: Readonly<Props & OverridenComponentProps<DefaultComponent, Props>>): ReactNode
}

export type BaseHtmlProps<T extends keyof JSX.IntrinsicElements, CustomProps extends object = object> = Readonly<
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  & JSX.IntrinsicElements[T]
  & CustomProps
>
