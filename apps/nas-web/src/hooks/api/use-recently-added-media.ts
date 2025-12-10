import baseUrl from '@/api/base-url'
import type { Item, LibraryType } from '@/api/fs/media'
import { getApiClient, makeQuery } from './query-client'

interface RecentlyAddedMedia {
  libraryType: LibraryType | null
  items: Item[]
}

const {
  useHook: useRecentlyAddedMedia,
} = makeQuery((module: string) => ({
  queryKey: ['fs', module, 'library', 'recently'],
  queryFn: () => {
    const { get } = getApiClient()
    return get<RecentlyAddedMedia>(`${baseUrl}${module}/media/recent`)
  },
  staleTime: 60_000,
}))

export default useRecentlyAddedMedia
