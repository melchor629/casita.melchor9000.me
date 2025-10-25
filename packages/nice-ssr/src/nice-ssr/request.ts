export type Logger = Pick<import('pino').Logger, 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'level'> & {
  child(bindings: Record<string, unknown>): Logger
}

export type SsrRequest<
  TParams extends Record<string, string> = Record<never, string>,
> = Request & {
  nice: Readonly<{
    /**
     * Original URL including the original pathname.
     */
    url: URL
    /**
     * Base path of all requests that runs into the system.
     */
    basePath: string
    /**
     * Relative pathname from the base path.
     */
    pathname: string
    originalPathname: string
    /**
     * Route parameters extracted from the pathname.
     */
    params: Readonly<TParams>
    /**
     * Logger instance.
     */
    log: Logger
  }>
}

export function mapToSsrRequest(
  request: Request,
  basePathname: string,
  originalPathname: string,
  matcher: RegExp,
  log: Logger,
): SsrRequest {
  const niceRequest = request as unknown as SsrRequest
  const url = new URL(request.url)
  const pathname = url.pathname.slice(basePathname.length - 1)
  niceRequest.nice = Object.freeze({
    basePath: basePathname,
    url,
    pathname,
    originalPathname,
    params: matcher.exec(pathname)?.groups ?? {},
    log,
  })
  return niceRequest
}
