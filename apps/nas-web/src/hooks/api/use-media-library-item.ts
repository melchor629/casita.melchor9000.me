import baseUrl from '@/api/base-url'
import type { ItemMetadata } from '@/api/fs/media'
import { getApiClient, makeQuery } from './query-client'

export const {
  fetch: fetchMediaLibraryItem,
  prefetch: prefetchMediaLibraryItem,
  useHook: useMediaLibraryItem,
} = makeQuery((module?: string | null, item?: string | null) => ({
  queryKey: ['fs', module, 'media', 'library-item', item] as const,
  queryFn({ queryKey }) {
    const [, module,,, itemId] = queryKey
    if (module && itemId) {
      const { get } = getApiClient()
      return get<ItemMetadata | null>(`${baseUrl}${module}/media/${itemId}`)
    }

    return null
  },
  staleTime: 5 * 60 * 1000,
}))
