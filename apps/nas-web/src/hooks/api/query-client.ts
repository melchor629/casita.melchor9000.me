import {
  type DataTag,
  QueryClient,
  type QueryKey,
  useSuspenseQuery,
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'
import { useMemo } from 'react'
import type { ApiClient } from '@/api/api-client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 7 * 24 * 60 * 60 * 1000,
    },
  },
})

export const getApiClient = () =>
  queryClient.getQueryData<ApiClient>(['api-client'])!

type QueryOptions<
  TQueryKey extends QueryKey = QueryKey,
  TData = unknown,
  TError extends Error = Error,
> = UseSuspenseQueryOptions<TData, TError, TData, TQueryKey> & {
  errorType?: new(...args: never[]) => TError,
}

export const makeQuery = <
  const TQueryKey extends QueryKey,
  TData,
  TError extends Error,
  const TParams extends unknown[],
>(fn: (...params: TParams) => QueryOptions<TQueryKey, TData, TError>): Readonly<{
  options: (...params: TParams) => QueryOptions<DataTag<TQueryKey, TData, TError>, TData, TError>,
  useHook: (...params: TParams) => UseSuspenseQueryResult<TData, TError>,
  fetch: (...params: TParams) => Promise<TData>,
  prefetch: (...params: TParams) => Promise<void>,
}> => ({
    fetch: (...params) => queryClient.fetchQuery(fn(...params)),
    options: (...params) => fn(...params) as QueryOptions<DataTag<TQueryKey, TData, TError>, TData, TError>,
    prefetch: (...params) => queryClient.prefetchQuery(fn(...params)),
    useHook: (...params) => useSuspenseQuery(useMemo(() => fn(...params), [params])),
  })

export default queryClient
