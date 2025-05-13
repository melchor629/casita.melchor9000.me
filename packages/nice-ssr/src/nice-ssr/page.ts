import type { FunctionComponent } from 'preact'
import type { SsrRequest } from './request'

export type Metadata = Readonly<{
  title?: string
  description?: string
  baseHref?: string
}>

export type PageLoaderContext<
  TParams extends Record<string, string> = Record<never, string>,
> = Omit<SsrRequest<TParams>, 'body'>

export type PageLoader<
  TLoaderData extends Record<string, unknown>,
  TParams extends Record<string, string> = Record<never, string>,
> = (context: PageLoaderContext<TParams>) => TLoaderData | Promise<TLoaderData>

export type PageModule<
  TLoaderData extends Record<string, unknown> = Record<string, unknown>,
  TParams extends Record<string, string> = Record<never, string>,
> = Readonly<{
  default: FunctionComponent<TLoaderData>
  metadata?: Metadata | ((props: TLoaderData) => Promise<Metadata> | Metadata)
  loader?: PageLoader<TLoaderData, TParams>
}>
