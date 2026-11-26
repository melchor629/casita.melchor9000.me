import type { FunctionComponent } from 'react'
import type { EmptyObject } from 'virtual:ts'
import type { SsrRequest } from './request'

export type Metadata = Readonly<{
  title?: string
  description?: string
  baseHref?: string
}>

export type PageLoaderContext<TParams extends Record<string, string> = EmptyObject> = Omit<
  SsrRequest<TParams>,
  'body' | 'bodyUsed' | 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
>

export type PageLoader<
  TLoaderData extends Record<string, unknown>,
  TParams extends Record<string, string> = EmptyObject,
> = (context: PageLoaderContext<TParams>) => TLoaderData | Promise<TLoaderData>

export type PageModule<
  TLoaderData extends Record<string, unknown> = Record<string, unknown>,
  TParams extends Record<string, string> = EmptyObject,
> = Readonly<{
  default: FunctionComponent<TLoaderData>
  metadata?: Metadata | ((props: TLoaderData) => Promise<Metadata> | Metadata)
  loader?: PageLoader<TLoaderData, TParams>
}>

export type PageHelperModule<TLoaderData extends Record<string, unknown> = EmptyObject> = Readonly<{
  default: FunctionComponent<TLoaderData>
}>
