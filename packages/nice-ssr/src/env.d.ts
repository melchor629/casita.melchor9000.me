/// <reference types="vite/client" />

declare module 'virtual:ssr/routes' {
  import type { PageModule, PageHelperModule, RouteHandler, RouteModule } from '@melchor629/nice-ssr'

  type Lazy<T> = () => Promise<T>
  export type RootPathModule = {
    middleware?: Lazy<{ readonly default: RouteHandler }>
    rootLayout?: Lazy<PageModule>
    route: PathModule
  }
  type BasePathModule = {
    pathname: `/${string}`
    matcher: RegExp
    children: PathModule[]
    layout?: Lazy<PageHelperModule>
    notFound?: Lazy<PageHelperModule>
    error?: Lazy<PageHelperModule<{ error: Error }>>
  }
  export type RoutePathModule = BasePathModule & {
    type: 'route'
    entry: Lazy<RouteModule>
  }
  export type PagePathModule = BasePathModule & {
    type: 'page'
    entry: Lazy<PageModule>
  }
  export type NothingPageModule = BasePathModule & {
    type: 'nothing'
  }
  export type ResourcePathModule =
    | PagePathModule
    | RoutePathModule
  export type PathModule =
    | ResourcePathModule
    | NothingPageModule

  const modules: RootPathModule
  export default modules
}
