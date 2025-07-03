/// <reference types="vite/client" />

declare module 'virtual:ssr/routes' {
  import type { PageModule, RouteHandler, RouteModule } from '@melchor629/nice-ssr'

  type Lazy<T> = () => Promise<T>
  export type PagePathModule = { type: 'page', pathname: string, entry: Lazy<PageModule> }
  export type RoutePathModule = { type: 'route', pathname: string, entry: Lazy<RouteModule> }
  export type RootLayoutPathModule = { type: 'root-layout', entry: Lazy<PageModule> }
  export type MiddlewarePathModule = { type: 'middleware', middleware: Lazy<{ readonly default: RouteHandler }> }
  export type ResourcePathModule =
    | PagePathModule
    | RoutePathModule
  export type PathModule =
    | ResourcePathModule
    | RootLayoutPathModule
    | MiddlewarePathModule

  const modules: ReadonlyArray<PathModule>
  export default modules
}
