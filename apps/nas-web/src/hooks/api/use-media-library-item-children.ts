import baseUrl from '@/api/base-url'
import type { Item } from '@/api/fs/media'
import { getApiClient, makeQuery } from './query-client'

interface MediaLibraryItemChildren {
  items: Item[]
}

export const {
  prefetch: prefetchMediaLibraryItemChildren,
  useHook: useMediaLibraryItemChildren,
} = makeQuery((module?: string | null, itemId?: string | null) => ({
  queryKey: ['fs', module, 'library', itemId, 'children'],
  queryFn: () => {
    if (!module || !itemId) {
      return null
    }

    const { get } = getApiClient()
    return get<MediaLibraryItemChildren>(`${baseUrl}${module}/media/${itemId}/children`)
  },
  staleTime: 5 * 60 * 1000,
}))
