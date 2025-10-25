import { getSsrErrorType, isSsrError } from '../nice-ssr/navigation.tsx'
import type { Logger } from '../nice-ssr/request.ts'
import { SsrResponse } from '../nice-ssr/response.ts'
import { get, getErrorPage, getNotFoundPage } from './route-handler.tsx'

type RenderRouteOptions = Readonly<{
  log: Logger
  basePathname?: `/${string}`
  error?: Error | 'not-found'
  processError?: ((error: Error) => void)
  signal: AbortSignal
  props?: Record<string, unknown>
}>

export async function renderRoute(
  request: Request,
  { basePathname, error, log, processError, props, signal }: RenderRouteOptions,
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

export { isSsrResponse } from '../nice-ssr/response.ts'
