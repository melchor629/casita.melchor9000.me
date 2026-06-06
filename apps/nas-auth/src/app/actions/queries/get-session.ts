import { notFound } from '@melchor629/nice-ssr'
import type { UseSuspenseQueryResult } from '@tanstack/react-query'
import { invokeAction, makeQuery } from '../helpers'
import type { ActionReturnType } from '../server'

export const {
  options: getSessionQueryOptions,
  prefetch: prefetchGetSession,
  useHook: useGetSession,
  usePrefillHook: usePrefillGetSession,
} = makeQuery(() => ({
  queryKey: ['session'],
  queryFn: () => invokeAction('get-session'),
  staleTime: 10 * 1000,
  refetchInterval: 60 * 1000,
  retry: 1,
}))

export function useEnsureGetSession() {
  const result = useGetSession()
  if (result.data == null) {
    notFound()
  }

  return result as UseSuspenseQueryResult<NonNullable<ActionReturnType<'get-session'>>, Error>
}
