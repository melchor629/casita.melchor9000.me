import { notFound } from '@melchor629/nice-ssr'
import { invokeAction, makeQuery } from '../helpers'

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
  const { data, ...rest } = useGetSession()
  if (data == null) {
    notFound()
  }

  return { data, ...rest }
}
