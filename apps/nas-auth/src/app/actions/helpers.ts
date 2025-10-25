import {
  type DataTag,
  type QueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryResult,
  type QueryKey,
  type UseSuspenseQueryOptions,
  type UseMutationOptions,
  useMutation,
  type UseMutationResult,
} from '@tanstack/react-query'
import { useMemo } from 'preact/hooks'
import type { ActionParameters, ActionReturnType, actions } from './server'
import { type FailableResult, type FailableValidationFields } from './server/helpers'

export const invokeAction = async <T extends keyof typeof actions>(
  action: T,
  ...args: ActionParameters<T>
): Promise<ActionReturnType<T>> => {
  const req = {
    method: 'POST',
    headers: {
      'x-nice-action': action,
    } as Record<string, string>,
    body: null as BodyInit | null,
    redirect: 'manual',
  } satisfies RequestInit
  if (args.length === 1 && args[0] instanceof FormData) {
    req.body = args[0]
    req.headers['x-nice-format'] = 'fd'
  } else if (args.length === 1 && args[0] instanceof URLSearchParams) {
    req.body = args[0]
    req.headers['x-nice-format'] = 's'
  } else if (args.length === 1 && args[0] instanceof Blob) {
    req.body = args[0]
    req.headers['x-nice-format'] = 'b'
  } else {
    req.body = JSON.stringify(args)
    req.headers['x-nice-format'] = 'j'
  }

  const response = await fetch('/actions', req)
  if (response.status === 307 || response.status === 308) {
    // TODO skips routing
    window.location.assign(response.headers.get('location') ?? '/')
  }

  const result = await response.json() as FailableResult<ActionReturnType<T>>
  if (result[0] === 'k') {
    return result[1]
  }

  if (result[0] === 'v') {
    throw new ValidationError(result[1])
  }

  if (result[0] === 'f') {
    throw new ForbiddenError(result[1])
  }

  throw Object.assign(
    new Error(result[1].message, { cause: result[1].cause }),
    { name: result[1].name },
  )
}

export class ValidationError extends Error {
  readonly fields: FailableValidationFields

  constructor(fields: FailableValidationFields) {
    super('The request has invalid data')
    this.fields = fields
  }
}

export class ForbiddenError extends Error {}

type ActionErrors = ValidationError | Error | TypeError

type InputQueryOptions<
  TQueryKey extends QueryKey = QueryKey,
  TData = unknown,
  TError extends Error = ActionErrors,
> = Omit<UseSuspenseQueryOptions<TData, TError, TData, TQueryKey>, 'queryFn'> & {
  errorType?: new(...args: never[]) => TError,
  queryFn: NonNullable<QueryOptions<TQueryKey, TData, TError>['queryFn']>
}

type InputMutationOptions<
  TData,
  TError extends Error = ActionErrors,
  TVariables = void,
  TContext = unknown,
> = Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> & {
  errorType?: new(...args: never[]) => TError,
  mutationFn: NonNullable<UseMutationOptions<TData, TError, TVariables, TContext>['mutationFn']>
}

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
>(fn: (...params: TParams) => InputQueryOptions<TQueryKey, TData, TError>): Readonly<{
  options: (...params: TParams) => QueryOptions<DataTag<TQueryKey, TData, TError>, TData, TError>,
  useHook: (...params: TParams) => UseSuspenseQueryResult<TData, TError>,
  usePrefillHook: (initial: TData, ...params: TParams) => UseSuspenseQueryResult<TData, TError>,
  fetch: (queryClient: QueryClient, ...params: TParams) => Promise<TData>,
  prefetch: (queryClient: QueryClient, ...params: TParams) => Promise<void>,
}> => ({
    fetch: (queryClient, ...params) => queryClient.fetchQuery(fn(...params)),
    options: (...params) => fn(...params) as unknown as QueryOptions<DataTag<TQueryKey, TData, TError>, TData, TError>,
    prefetch: (queryClient, ...params) => queryClient.prefetchQuery(fn(...params)),
    useHook: (...params) => useSuspenseQuery(fn(...params)),
    usePrefillHook: (initial, ...params) =>
      useSuspenseQuery({ ...fn(...params), initialData: initial, initialDataUpdatedAt: useMemo(() => Date.now(), []) }),
  })

export const makeMutation = <
  TData,
  TError extends Error,
  TVariables = void,
  TContext = unknown,
>(options: InputMutationOptions<TData, TError, TVariables, TContext>): Readonly<{
  useHook: () => UseMutationResult<TData, TError, TVariables, TContext>
}> =>
    Object.freeze({
      useHook: () => useMutation(options),
    })
