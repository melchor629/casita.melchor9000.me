// eslint-disable-next-line import-x/no-unresolved
import routeModules, { type PathModule, type ResourcePathModule } from 'virtual:ssr/routes'
import { mapToSsrRequest, type Logger } from '../nice-ssr/request.ts'
import { SsrResponse } from '../nice-ssr/response.ts'
import renderPage from './page-render.tsx'
import { runWithStorage } from './request-storage.ts'
import runRouteHandler from './route-runner.ts'

function memoize<TParams extends unknown[], TReturn>(
  implementationFn: (...args: TParams) => TReturn,
  keyFn: (...args: TParams) => string,
) {
  const cache = new Map<string, TReturn>()
  const memoizedFn = function memoized(...args: TParams): TReturn {
    const key = args.length === 0 ? 'key' : keyFn(...args)
    let returnValue: TReturn
    if (!cache.has(key)) {
      returnValue = implementationFn(...args)
      cache.set(key, returnValue)
    } else {
      returnValue = cache.get(key)!
    }
    return returnValue
  }
  memoizedFn.clear = (): void => cache.clear()
  return memoizedFn
}

const pathParamRegex = /\[(\w+)\]/g
const getPathRegex = memoize((pageModule: PathModule) => {
  if (pageModule.type === 'root-layout' || pageModule.type === 'middleware') {
    return null
  }

  return new RegExp(
    '^'
    + pageModule.pathname
      .split('/')
      .map((s) => s.replaceAll(pathParamRegex, '(?<$1>\\w+?)'))
      .join('\\/')
    + '$',
  )
}, (pageModule) => 'pathname' in pageModule ? pageModule.pathname : pageModule.type)

type RouteHandle = Readonly<{
  type: ResourcePathModule['type']
  routePathname: ResourcePathModule['pathname']
  render(request: Request, log: Logger, pathname: string): Promise<Response>
}>

type MiddlewareHandle = Readonly<{
  execute(request: Request, basePath: string, log: Logger): Promise<{ type: 'next', headers: Headers } | { type: 'response', response: Response }>
}>

const getRouteHandler = memoize((routeMatch: ResourcePathModule): RouteHandle => ({
  type: routeMatch.type,
  routePathname: routeMatch.pathname,
  render: async (request, log, pathname) => {
    const params = getPathRegex(routeMatch)?.exec(pathname)?.groups ?? {}
    const niceRequest = mapToSsrRequest(
      request,
      pathname,
      routeMatch.pathname,
      params,
      log,
    )
    if (routeMatch.type === 'page') {
      const response = await runWithStorage(async () => renderPage(await routeMatch.entry(), niceRequest))
      return response
    }
    if (routeMatch.type === 'route') {
      const response = await runWithStorage(async () => runRouteHandler(await routeMatch.entry(), niceRequest))
      return response
    }
    return SsrResponse
      .new()
      .status('internal-server-error')
      .text('Cannot handle this route')
  },
}), (routeMatch) => routeMatch.pathname)

export function get(pagePath: string): RouteHandle | undefined {
  pagePath ||= '/'
  const pageMatch = routeModules
    .filter((page): page is ResourcePathModule => page.type === 'page' || page.type === 'route')
    .find((page) => getPathRegex(page)?.test(pagePath))
  if (pageMatch) {
    return getRouteHandler(pageMatch)
  }
}

export function * getAll(): Generator<RouteHandle> {
  for (const routeModule of routeModules) {
    if (routeModule.type === 'root-layout' || routeModule.type === 'middleware') continue

    yield getRouteHandler(routeModule)
  }
}

export const getMiddleware: (() => MiddlewareHandle | null) & { clear(): void } = memoize(function getMiddleware() {
  const middlewareMatch = routeModules
    .filter((module) => module.type === 'middleware')
    .at(0)
  if (middlewareMatch) {
    return {
      execute: async (request: Request, basePath: string, log: Logger) => {
        const pathname = new URL(request.url).pathname.slice(basePath.length - 1)
        const niceRequest = mapToSsrRequest(
          request,
          pathname,
          pathname,
          {},
          log,
        )
        const { default: middleware } = await middlewareMatch.middleware()
        const response = await middleware(niceRequest)
        if (response instanceof SsrResponse && response.isNextResponse()) {
          return { type: 'next', headers: response.headers } as const
        }
        return { type: 'response', response } as const
      },
    }
  }

  return null
}, () => '')

export { isSsrResponse, extractBodyFromSsrResponse } from '../nice-ssr/response.ts'
export { isSsrError, getSsrErrorType } from '../nice-ssr/navigation.tsx'

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    getPathRegex.clear()
    getRouteHandler.clear()
    getMiddleware.clear()
  })
}
