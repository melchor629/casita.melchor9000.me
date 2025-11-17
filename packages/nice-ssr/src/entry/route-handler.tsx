// eslint-disable-next-line import-x/no-unresolved
import routeModules, { type PathModule, type ResourcePathModule } from 'virtual:ssr/routes'
import { mapToSsrRequest, type Logger } from '../nice-ssr/request.ts'
import { SsrResponse } from '../nice-ssr/response.ts'
import renderPage from './page-render.tsx'
import { runWithStorage } from './request-storage.ts'
import runRouteHandler from './route-runner.ts'
import { startSpan } from './tracer.ts'

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

type RouteHandle = Readonly<{
  type: ResourcePathModule['type']
  routePathname: ResourcePathModule['pathname']
  render(request: Request, log: Logger, basePathname: string, props?: Record<string, unknown>): Promise<Response>
}>

const getRouteHandler = memoize((
  routePath: [...PathModule[], ResourcePathModule],
  status: number | undefined,
  moreProps: Record<string, unknown> | undefined,
): RouteHandle => ({
  type: (routePath.at(-1)! as ResourcePathModule).type,
  routePathname: routePath.at(-1)!.pathname,
  render: async (request, log, basePathname, props) => {
    log.debug('Preparing route execution')
    const routeMatch = routePath.at(-1)! as ResourcePathModule
    const niceRequest = mapToSsrRequest(
      request,
      basePathname,
      routeMatch.pathname,
      routeMatch.matcher,
      log,
    )

    if (routeModules.middleware) {
      log.debug('Running middleware')
      const response = await startSpan('run middleware', async () => {
        const { default: middleware } = await routeModules.middleware!()
        return await middleware(niceRequest)
      })
      if (!(response instanceof SsrResponse) || !response.isNextResponse()) {
        log.debug('Middleware gave a response, returning earlier')
        return response
      }
    }

    if (routeMatch.type === 'page') {
      const layouts = routePath.flatMap((r) => r.layout ? [r.layout] : [])
      const response = await startSpan('render page', async () => {
        const entry = await startSpan('load page entry', () => routeMatch.entry())
        return runWithStorage(async () => renderPage(entry, { layouts, status, props: { ...props, ...moreProps } }, niceRequest))
      })
      return response
    }
    if (routeMatch.type === 'route') {
      const response = await startSpan('render route', async () => {
        const entry = await startSpan('load route entry', () => routeMatch.entry())
        return runWithStorage(async () => runRouteHandler(entry, niceRequest))
      })
      return response
    }
    return SsrResponse
      .new()
      .status('internal-server-error')
      .text('Cannot handle this route')
  },
}), (routeMatch) => routeMatch.at(-1)!.pathname)

const calculateRoutePath = (
  path: string,
  route: PathModule,
): PathModule[] => {
  const match = route.matcher.exec(path)
  if (match == null) {
    return []
  }

  return [
    route,
    ...(
      Iterator.from(route.children)
        .map((r) => calculateRoutePath(path, r))
        .filter((rh) => rh.length > 0)
        .filter((rh) => rh.at(-1)!.type !== 'nothing')
        .toArray()
        .toSorted((a, b) => b.at(-1)!.matcher.exec(path)![0].length - a.at(-1)!.matcher.exec(path)![0].length)
        .at(0) ?? []
    ),
  ]
}

export function get(pagePath: string): RouteHandle | undefined {
  pagePath ||= '/'
  const routePath = calculateRoutePath(pagePath, routeModules.route)
  const routeMatch = routePath.at(-1)
  if (!routeMatch || routeMatch?.type === 'nothing') {
    return undefined
  }

  const routeHandler = getRouteHandler([...routePath.slice(0, -1), routeMatch], undefined, undefined)
  return routeHandler
}

function * flattenRoutes(route: PathModule, path: PathModule[]): Iterable<RouteHandle> {
  if (route.type !== 'nothing') {
    yield getRouteHandler([...path, route], undefined, undefined)
  }
  yield * Iterator.from(route.children)
    .flatMap((r) => flattenRoutes(r, [...path, route]))
}

export function * getAll(): Generator<RouteHandle> {
  yield * flattenRoutes(routeModules.route, [])
}

export function getNotFoundPage(path: `/${string}`): RouteHandle {
  const routePath = calculateRoutePath(path, routeModules.route)
  const notFoundPathIndex = routePath
    .findLastIndex((r) => r.error != null)
  const notFoundRoutePath = notFoundPathIndex !== -1 ? routePath[notFoundPathIndex] : null
  return getRouteHandler([
    ...routePath.slice(0, notFoundPathIndex),
    {
      children: [],
      layout: notFoundRoutePath?.layout,
      entry: notFoundRoutePath?.notFound
        ?? (() => Promise.resolve({ default: () => 'Page not found' })),
      matcher: /^$/,
      pathname: `${notFoundRoutePath?.pathname ?? ''}/_not_found`,
      type: 'page',
    },
  ], 404, {})
}

export function getErrorPage(path: `/${string}`, error: unknown): RouteHandle {
  const routePath = calculateRoutePath(path, routeModules.route)
  const errorRoutePathIndex = routePath
    .findLastIndex((r) => r.error != null)
  const errorRoutePath = errorRoutePathIndex !== -1 ? routePath[errorRoutePathIndex] : null
  return getRouteHandler([
    ...routePath.slice(0, errorRoutePathIndex),
    {
      children: [],
      layout: errorRoutePath?.layout,
      entry: (errorRoutePath?.error as never)
        ?? (() => Promise.resolve({ default: () => 'Page has errors' })),
      matcher: /^$/,
      pathname: `${errorRoutePath?.pathname ?? ''}/_error`,
      type: 'page',
    },
  ], 500, { error })
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    getRouteHandler.clear()
  })
}
