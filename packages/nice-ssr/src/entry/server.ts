import type { Span } from '@opentelemetry/api'
import { getSsrErrorType, isSsrError } from '../nice-ssr/navigation.tsx'
import type { Logger } from '../nice-ssr/request.ts'
import { SsrResponse } from '../nice-ssr/response.ts'
import { get, getErrorPage, getNotFoundPage } from './route-handler.tsx'
import { startSpan } from './tracer.ts'

type RenderRouteOptions = Readonly<{
  log: Logger
  basePathname?: `/${string}`
  error?: Error | 'not-found'
  processError?: ((error: Error) => void)
  signal: AbortSignal
  props?: Record<string, unknown>
}>

async function renderRouteInternal(
  request: Request,
  { basePathname, error, log, processError, props, signal }: RenderRouteOptions,
  span: Span,
): Promise<Response> {
  log.debug('Locating route')
  // get relative pathname from the basePathname/prefix
  const url = new URL(request.url)
  const pathname = url.pathname.slice((basePathname?.length ?? 1) - 1) as `/${string}`
  const route = error === 'not-found'
    ? getNotFoundPage(pathname)
    : error
      ? getErrorPage(pathname, error)
      : get(pathname) ?? getNotFoundPage(pathname)

  span.setAttribute('nice-ssr.pathname', route.routePathname)
  span.setAttribute('nice-ssr.type', route.type)
  if (error) {
    span.setAttribute('nice-ssr.error', error instanceof Error ? 'error' : error)
  }

  try {
    log.debug('Generating response')
    const res = await route.render(
      request,
      log,
      basePathname ?? '/',
      props,
    )
    return res
  } catch (e) {
    span.recordException(e instanceof Error ? e : 'Unknown error')
    if (error || !(e instanceof Error)) {
      return SsrResponse.new().status('internal-server-error').empty()
    }

    if (isSsrError(e)) {
      const type = getSsrErrorType(e)
      if (type === 'not-found') {
        log.debug('Received not found from code')
        return renderRoute(request, { log, basePathname, processError, error: 'not-found', signal, props })
      } else if (type === 'redirect') {
        return SsrResponse.redirect(e.message)
      }
    }

    try {
      processError?.(e)
    } catch {}
    log.error(e, 'Rendering error')
    return renderRoute(request, { log, basePathname, error: e, signal, processError, props })
  }
}

export async function renderRoute(
  request: Request,
  options: RenderRouteOptions,
): Promise<Response> {
  const url = new URL(request.url)
  return await startSpan(
    options.error ? `render error ${request.method} ${url.pathname}` : `render ${request.method} ${url.pathname}`,
    async (span) => {
      return await renderRouteInternal(request, options, span)
    },
  )
}

export { isSsrResponse } from '../nice-ssr/response.ts'
