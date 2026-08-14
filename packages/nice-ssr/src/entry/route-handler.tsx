import { trace } from '@opentelemetry/api'
// eslint-disable-next-line import-x/no-unresolved
import { getRouteModulePath, modules, type PathModule, type ResourcePathModule } from 'virtual:ssr/routes'
import type { CsrError } from '../nice-ssr/error.tsx'
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
  routePath: readonly [...PathModule[], ResourcePathModule],
  status: number | undefined,
  { _pageType, ...moreProps }: Record<string, unknown> & { _pageType?: 'page' | 'not-found' | 'error' },
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

    if (modules.middleware) {
      log.debug('Running middleware')
      const response = await startSpan('run middleware', async () => {
        const { default: middleware } = await modules.middleware!()
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
        return runWithStorage(async () => renderPage(entry, { layouts, status, props: { ...props, ...moreProps }, type: _pageType! }, niceRequest))
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
}), (routeMatch, _, { _pageType = '·' }) => _pageType + routeMatch.at(-1)!.pathname)

export function get(pagePath: string): RouteHandle | undefined {
  const routePath = getRouteModulePath(pagePath, 'page')
  return routePath ? getRouteHandler(routePath, undefined, { _pageType: 'page' }) : undefined
}

function * flattenRoutes(route: PathModule, path: PathModule[]): Iterable<RouteHandle> {
  if (route.type !== 'nothing') {
    yield getRouteHandler([...path, route], undefined, { _pageType: 'page' })
  }
  yield * Iterator.from(route.children)
    .flatMap((r) => flattenRoutes(r, [...path, route]))
}

export function * getAll(): Generator<RouteHandle> {
  yield * flattenRoutes(modules.route, [])
}

export function getNotFoundPage(path: `/${string}`): RouteHandle {
  return getRouteHandler(getRouteModulePath(path, 'not-found'), 404, { _pageType: 'not-found' })
}

const mapError = (error: unknown): CsrError => {
  const digest = trace.getActiveSpan()?.spanContext()?.traceId ?? ''
  if (error == null) {
    return {
      message: 'Unknown error',
      digest,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: import.meta.env.DEV ? error.stack : undefined,
      digest,
      cause: error.cause ? mapError(error.cause) : undefined,
    }
  }

  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return {
      message: error.message,
      digest,
    }
  }

  if (typeof error === 'string') {
    return {
      message: error,
      digest,
    }
  }

  return {
    message: 'Unknown error',
    digest,
  }
}

export function getErrorPage(path: `/${string}`, error: unknown): RouteHandle {
  return getRouteHandler(getRouteModulePath(path, 'error'), 500, { error: mapError(error), _pageType: 'error' })
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    getRouteHandler.clear()
  })
}
