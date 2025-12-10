import baseUrl from '@/api/base-url'
import type { SearchResults } from '@/api/fs/media'
import { getApiClient, makeQuery } from './query-client'

export const {
  useHook: useMediaLibrarySearchResults,
} = makeQuery((module: string, query: string) => ({
  queryKey: ['fs', module, 'media', 'search', query],
  queryFn() {
    if (query.length > 1) {
      const { get } = getApiClient()
      return get<SearchResults>(`${baseUrl}${module}/media/search`, { query: { query } })
    }

    return null
  },
  refetchOnWindowFocus: false,
  staleTime: 5 * 60 * 1000,
  gcTime: 15 * 60 * 1000,
}))

export default useMediaLibrarySearchResults
