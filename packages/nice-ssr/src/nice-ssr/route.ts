import type { EmptyObject } from 'virtual:ts'
import type { SsrRequest } from './request'

export type RouteHandler<TParams extends Record<string, string> = EmptyObject> = (
  request: SsrRequest<TParams>,
) => Promise<Response>

export type RouteModule<TParams extends Record<string, string> = EmptyObject> = {
  readonly [
    Method in 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'
  ]?: RouteHandler<TParams>
}
