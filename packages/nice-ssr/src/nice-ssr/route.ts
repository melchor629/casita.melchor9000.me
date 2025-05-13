import type { SsrRequest } from './request'

export type RouteHandler<
  TParams extends Record<string, string> = Record<never, string>,
> = (request: SsrRequest<TParams>) => Promise<Response>

export type RouteModule<
  TParams extends Record<string, string> = Record<never, string>,
> = {
  readonly [Method in 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS']?: RouteHandler<TParams>
}
