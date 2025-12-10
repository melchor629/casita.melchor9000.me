import { type ApiClient, ApiClientException } from '../api/api-client'
import * as fs from '../api/fs'
import type { DirectoryMetadata } from '../api/fs/directory'
import type { FileMetadata } from '../api/fs/file'
import type { ThumbnailManifest, ThumbnailRequestOptions } from '../api/fs/thumbnail-manifest'
import type { JobState, JobWorker } from '../hooks/use-job-handler'
import * as Path from './path'

export const getManifest = (
  apiClient: ApiClient,
  module: string,
  metadata: DirectoryMetadata | FileMetadata,
  signal?: AbortSignal,
) => {
  if (metadata.type === 'dir' || !metadata.mime) {
    return Promise.resolve<ThumbnailManifest>({
      modificationTime: Date.now().toString(),
      images: null,
    })
  }

  return fs.getThumbnailManifest(apiClient, module, metadata.path, signal)
}

const thumbnailBlobUrlCache = new Map<string, readonly [string, Blob]>()
export const getThumbnail = async (
  apiClient: ApiClient,
  module: string,
  metadata: DirectoryMetadata | FileMetadata,
  options?: ThumbnailRequestOptions,
  signal?: AbortSignal | null,
  ignoreCache?: boolean,
): Promise<readonly [string, Blob] | null> => {
  if (metadata.type === 'dir' || !metadata.mime) {
    return null
  }

  const cacheKey = `${module}:${metadata.path}:${options?.format || 'jpg'}`
  if (!ignoreCache && thumbnailBlobUrlCache.has(cacheKey)) {
    return thumbnailBlobUrlCache.get(cacheKey)!
  }

  try {
    const blob = await fs.getThumbnail(apiClient, module, metadata.path, {
      ...options,
      signal,
      cache: !ignoreCache,
    })
    const blobUrl = URL.createObjectURL(blob)
    thumbnailBlobUrlCache.set(cacheKey, [blobUrl, blob])
    return [blobUrl, blob]
  } catch (e) {
    if (e instanceof ApiClientException && e.response.status === 404) {
      return null
    }
    throw e
  }
}

interface ThumbnailGenerationParams {
  module: string
  metadata: DirectoryMetadata | FileMetadata
}

interface ThumbnailGenerationData {
  module: string
  jobId: string
}

type ThumbnailGenerationWorker = JobWorker<ThumbnailGenerationParams, ThumbnailGenerationData>

export const thumbnailGenerationWorker: ThumbnailGenerationWorker = {
  abort() {
    // TODO
    return Promise.resolve()
  },
  async enqueue(apiClient, { metadata, module }) {
    const { jobId } = await fs.createThumbnailJob(apiClient, module, {
      name: Path.basename(metadata.path),
      params: {
        path: metadata.path,
        generateThumbnails: {
          sizes: ['sm', 'lg'],
          formats: ['webp', 'avif'],
        },
      },
    })
    return {
      data: { jobId, module },
      abortable: false,
      name: Path.basename(metadata.path),
      retriable: false,
    }
  },
  retry(_apiClient, job) {
    // TODO
    return Promise.resolve(job.data)
  },
  async update(apiClient, jobs) {
    const jobsByModule = jobs.reduce<Record<string, typeof jobs>>(
      (grouped, job) => ({
        ...grouped,
        [job.data.module]: [...(grouped[job.data.module] || []), job],
      }),
      {},
    )
    const jobDetails = await Promise.allSettled(
      Object.entries(jobsByModule)
        .map(async ([module, js]) => (
          [await fs.getThumbnailJobs(apiClient, module, js.map((j) => j.data.jobId)), js] as const
        )),
    )
    return jobDetails.map((result): JobState[] => {
      if (result.status === 'fulfilled') {
        return result.value[0].jobs
          .map((s, i) => [s, result.value[1][i]] as const)
          .map(([status, { id }]): JobState => {
            if (status === null) {
              return { id, state: 'failed', message: 'Job does not exist' }
            }

            switch (status.state) {
              case 'active': return { id, state: 'processing', progress: status.progress / 100 }
              case 'completed': return {
                id,
                state: 'succeeded',
              }
              case 'failed': return {
                id,
                state: 'failed',
                message: status.failedReason,
                error: {
                  name: 'JobError',
                  message: status.failedReason,
                  stack: status.stackTrace,
                },
              }
              case 'waiting': return { id, state: 'enqueued' }
              default: return { id, state: 'failed', message: `Job in ${status.state}` }
            }
          })
      }

      return []
    }).flat()
  },
}
