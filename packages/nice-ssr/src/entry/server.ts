// eslint-disable-next-line import-x/no-unresolved
import routeModules, { type PathModule, type ResourcePathModule } from 'virtual:ssr/routes'
import { mapToSsrRequest, type Logger } from '../nice-ssr/request.ts'
import { SsrResponse } from '../nice-ssr/response.ts'
import renderPage from './page-render.tsx'
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
  memoizedFn.clear = () => cache.clear()
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

const getRouteHandler = memoize((routeMatch: ResourcePathModule) => ({
  type: routeMatch.type,
  routePathname: routeMatch.pathname,
  render: async (request: Request, log: Logger, pathname: string) => {
    const params = getPathRegex(routeMatch)?.exec(pathname)?.groups ?? {}
    const niceRequest = mapToSsrRequest(
      request,
      pathname,
      routeMatch.pathname,
      params,
      log,
    )
    if (routeMatch.type === 'page') {
      const response = await renderPage(routeMatch.entry, niceRequest)
      return response
    }
    if (routeMatch.type === 'route') {
      const response = await runRouteHandler(routeMatch.entry, niceRequest)
      return response
    }
    return SsrResponse
      .new()
      .status('internal-server-error')
      .text('Cannot handle this route')
  },
}), (routeMatch) => routeMatch.pathname)

export function get(pagePath: string) {
  pagePath ||= '/'
  const pageMatch = routeModules
    .filter((page): page is ResourcePathModule => page.type === 'page' || page.type === 'route')
    .find((page) => getPathRegex(page)?.test(pagePath))
  if (pageMatch) {
    return getRouteHandler(pageMatch)
  }
}

export function * getAll() {
  for (const routeModule of routeModules) {
    if (routeModule.type === 'root-layout' || routeModule.type === 'middleware') continue

    yield getRouteHandler(routeModule)
  }
}

export const getMiddleware = memoize(function getMiddleware() {
  const middleware = routeModules
    .filter((module) => module.type === 'middleware')
    .at(0)
  if (middleware) {
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
        const response = await middleware.middleware(niceRequest)
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
