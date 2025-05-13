import type { FastifyBaseLogger } from 'fastify'

export type Logger = FastifyBaseLogger

export type SsrRequest<
  TParams extends Record<string, string> = Record<never, string>,
> = Request & {
  nice: Readonly<{
    url: URL
    basePath: string
    pathname: string
    originalPathname: string
    params: Readonly<TParams>
    log: Logger
  }>
}

export function mapToSsrRequest(
  request: Request,
  pagePath: string,
  originalPathname: string,
  params: Record<string, string>,
  log: Logger,
) {
  const niceRequest = request as unknown as SsrRequest
  const url = new URL(request.url)
  niceRequest.nice = Object.freeze({
    basePath: url.pathname.slice(0, -pagePath.length).replace(/\/$/, '') + '/',
    url,
    pathname: pagePath,
    originalPathname,
    params,
    log,
  })
  return niceRequest
}
