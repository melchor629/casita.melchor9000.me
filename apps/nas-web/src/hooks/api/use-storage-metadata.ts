import baseUrl from '@/api/base-url'
import { sanitizePathForUrl } from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import { getApiClient, makeQuery } from './query-client'

type StorageMetadata = DirectoryMetadata | FileMetadata

export const {
  prefetch: prefetchStorageMetadata,
  useHook: useStorageMetadata,
} = makeQuery((module: string, path: string) => ({
  queryKey: ['fs', module, 'storage', path],
  queryFn: () => {
    const { get } = getApiClient()
    return get<StorageMetadata>(`${baseUrl}${module}/info/${sanitizePathForUrl(path)}`)
  },
  staleTime: 60_000,
  refetchOnWindowFocus: false,
}))
