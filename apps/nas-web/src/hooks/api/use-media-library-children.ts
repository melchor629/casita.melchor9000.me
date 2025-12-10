import baseUrl from '@/api/base-url'
import type { Item, LibraryType } from '@/api/fs/media'
import { getApiClient, makeQuery } from './query-client'

interface MediaLibraryChildren {
  libraryType: LibraryType | null
  items: Item[]
}

export const {
  prefetch: prefetchMediaLibraryChildren,
  useHook: useMediaLibraryChildren,
} = makeQuery((module?: string | null) => ({
  queryKey: ['fs', module, 'library'],
  queryFn: () => {
    if (!module) {
      return null
    }

    const { get } = getApiClient()
    return get<MediaLibraryChildren>(`${baseUrl}${module}/media`)
  },
  staleTime: 60_000,
}))
