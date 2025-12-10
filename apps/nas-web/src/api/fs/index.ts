import { hasWebpSupport } from '@/utils/image-support'
import * as Path from '@/utils/path'
import { type ApiClient, ApiClientException } from '../api-client'
import baseUrl from '../base-url'
import FSEvents from './fs-events'
import type {
  GenerateThumbnailJobDetails,
  GenerateThumbnailRequest,
  JobCreatedResponse,
  SynchronizeJobDetails,
  SynchronizeRequest,
} from './jobs'
import type { ThumbnailManifest, ThumbnailRequestOptions } from './thumbnail-manifest'

export const sanitizePathForUrl = (unsanitizedPath: string) => unsanitizedPath
  .split('/')
  .map((s) => encodeURIComponent(s))
  .join('/')

export async function getDownloadUrl(
  module: string,
  path: string,
  apiClient: ApiClient,
): Promise<string>
export async function getDownloadUrl(
  module: string,
  path: string[],
  apiClient: ApiClient,
): Promise<string[]>
export async function getDownloadUrl(
  module: string,
  path: string | string[],
  apiClient: ApiClient,
): Promise<string | string[]> {
  const token = await apiClient.getAccessToken()
  const generateUrl = (p: string) => `${baseUrl}${Path.join(module, 'storage', sanitizePathForUrl(p || '/'))}?token=${token}`
  if (Array.isArray(path)) {
    return path.map(generateUrl)
  }
  return generateUrl(path)
}

export const downloadFile = (
  { getRaw }: ApiClient,
  module: string,
  path: string,
  type: 'blob' | 'text',
  signal?: AbortSignal,
) => getRaw(`${module}/storage/${sanitizePathForUrl(path)}`, type, { signal })

export const openFileSystemEvents = (module: string, apiClient: ApiClient) => (
  FSEvents.createForModule(module, apiClient)
)

export const move = (
  { post }: ApiClient,
  module: string,
  path: string,
  newPath: string,
): Promise<{ done: true, path: string }> => post(`${module}/move`, { path: path || '.', newPath })

export const rename = (
  apiClient: ApiClient,
  module: string,
  path: string,
  newName: string,
): Promise<{ done: true, path: string }> => {
  const newPath = Path.join(Path.dirname(path), newName)
  return move(apiClient, module, path, newPath)
}

export const remove = (
  { post }: ApiClient,
  module: string,
  path: string,
  recursive?: boolean,
): Promise<{ done: true }> => post(`${baseUrl}${module}/remove`, { path: path || '.', recursive })

export const newFolder = (
  { post }: ApiClient,
  module: string,
  path: string,
  folderName: string,
): Promise<{ done: true, path: string }> => post(`${baseUrl}${module}/new-folder`, { path: path || '.', folderName })

export const getThumbnailManifest = (
  { get }: ApiClient,
  module: string,
  path: string,
  signal?: AbortSignal,
): Promise<ThumbnailManifest> => get(`${baseUrl}${Path.join(module, 'thumbnail-manifest', sanitizePathForUrl(path))}`, { signal })

export const getThumbnailUrl = (
  module: string,
  path: string,
  opts: ThumbnailRequestOptions = {},
): string => {
  const url = `${baseUrl}${Path.join(module, 'thumbnail', sanitizePathForUrl(path))}`
  const searchParams = new URLSearchParams()
  Object.entries(opts)
    .filter(([key, value]) => key !== 'signal' && key !== 'cache' && value)
    .forEach(([key, value]) => searchParams.set(key, (value as string | number).toString()))
  return `${url}?${searchParams}`
}

export const getThumbnail = (
  { getRaw }: ApiClient,
  module: string,
  path: string,
  opts: ThumbnailRequestOptions & { signal?: AbortSignal | null, cache?: boolean } = {},
): Promise<Blob> => getRaw(getThumbnailUrl(module, path, opts), 'blob', { signal: opts.signal, cache: opts.cache ? 'default' : 'reload' })

export const startUpload = (
  { put }: ApiClient,
  module: string,
  directoryPath: string,
  fileName: string,
): Promise<{ uploadToken: string }> => put(`${baseUrl}${Path.join(module, 'upload')}`, { directoryPath, fileName })

export const resumeUpload = (
  { put }: ApiClient,
  module: string,
  directoryPath: string,
  fileName: string,
  uploadToken: string,
): Promise<{ uploadToken: string, startPosition: number }> => put(`${baseUrl}${Path.join(module, 'upload')}`, {
  directoryPath, fileName, resume: true, uploadToken,
})

export const endUpload = (
  { patch }: ApiClient,
  module: string,
  uploadToken: string,
): Promise<void> => patch(`${baseUrl}${Path.join(module, 'upload', uploadToken)}`, {})

export const cancelUpload = ({ del }: ApiClient, module: string, uploadToken: string): Promise<void> =>
  del(`${baseUrl}${Path.join(module, 'upload', uploadToken)}`)

export const doUpload = (
  { post }: ApiClient,
  module: string,
  uploadToken: string,
  chunk: Blob,
  signal: AbortSignal,
) => {
  const data = new FormData()
  data.append('file', chunk, 'chunk')
  const url = `${baseUrl}${Path.join(module, 'upload', uploadToken)}`
  return post<FormData, { bytesWritten: number, position: number }>(url, data, { signal })
}

export const createThumbnailJob = (
  { put }: ApiClient,
  module: string,
  args: GenerateThumbnailRequest,
  signal?: AbortSignal,
): Promise<JobCreatedResponse> => put(`${baseUrl}${module}/jobs/thumbnail`, args, { signal })

export const getThumbnailJob = (
  { get }: ApiClient,
  module: string,
  jobId: string,
): Promise<GenerateThumbnailJobDetails> => get(`${baseUrl}${module}/jobs/thumbnail/${jobId}`)

export const getThumbnailJobs = (
  { get }: ApiClient,
  module: string,
  jobIds: string[],
): Promise<{ jobs: Array<GenerateThumbnailJobDetails | null> }> => get(`${baseUrl}${module}/jobs/thumbnail/jobs`, { query: { jobIds } })

export const createSynchronizeJob = (
  { put }: ApiClient,
  module: string,
  args: SynchronizeRequest,
  signal?: AbortSignal,
): Promise<JobCreatedResponse> => put(`${baseUrl}${module}/jobs/synchronize`, args, { signal })

export const getSynchronizeJob = (
  { get }: ApiClient,
  module: string,
  jobId: string,
): Promise<SynchronizeJobDetails> => get(`${baseUrl}${module}/jobs/synchronize/${jobId}`)

export const createAlias = (
  { post }: ApiClient,
  module: string,
  paths: string[],
): Promise<{ id: string, url: string, urls: Record<string, string> }> => post(`${baseUrl}${module}/a`, { paths })

export const deleteThumbnails = (
  { del }: ApiClient,
  module: string,
  path: string,
  opts: { signal?: AbortSignal | null } = {},
): Promise<void> => del(getThumbnailUrl(module, path, {}), { signal: opts.signal })

export const getItemThumbnail = (
  { getRaw }: ApiClient,
  module: string,
  itemId: string,
  thumbnailKey: string,
  options?: { width?: number, height?: number },
) => {
  const types = ['image/jpeg', 'image/*']
  if (hasWebpSupport()) {
    types.unshift('image/webp')
  }
  // disabled for now, pi suffers too much
  /* if (hasAvifSupport()) {
    types.unshift('image/avif')
  } */

  return getRaw(`${baseUrl}${module}/media/${itemId}/thumbnail/${thumbnailKey}`, 'blob', {
    headers: {
      accept: types.join(','),
    },
    query: {
      w: options?.width?.toString(),
      h: options?.height?.toString(),
    },
  }).catch((error) => {
    if (error instanceof ApiClientException && error.response.status === 404) {
      return null
    }

    throw error
  })
}
