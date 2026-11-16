import type { ReactNode } from 'react'
// eslint-disable-next-line import-x/no-extraneous-dependencies
import {
  render as baseRender,
  renderHook as baseRenderHook,
  type RenderHookOptions,
  type RenderOptions,
} from 'vitest-browser-react'

const ThemeWrapper = ({ children }: React.PropsWithChildren) => (
  <div data-theme="light">{children}</div>
)

export const render = (ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) =>
  baseRender(ui, { ...options, wrapper: ThemeWrapper })

export const renderHook = <Props, Result>(
  render: (props?: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'>,
) => baseRenderHook<Props, Result>(render, { ...options, wrapper: ThemeWrapper })
