/// <reference types="vite/client" />

declare module 'virtual:ssr/routes' {
  import type { PageModule, RouteHandler, RouteModule } from '@melchor629/nice-ssr'

  export type PagePathModule = { type: 'page', pathname: string, entry: PageModule }
  export type RoutePathModule = { type: 'route', pathname: string, entry: RouteModule }
  export type RootLayoutPathModule = { type: 'root-layout', entry: PageModule['default'] }
  export type MiddlewarePathModule = { type: 'middleware', prefix: string, middleware: RouteHandler }
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
