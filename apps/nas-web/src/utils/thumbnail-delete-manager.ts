import { ApiClientException } from '../api/api-client'
import { deleteThumbnails } from '../api/fs'
import type { DirectoryMetadata } from '../api/fs/directory'
import type { FileMetadata } from '../api/fs/file'
import UiWorker, { type JobContext } from './ui-worker'

type ThumbnailDeleteJobParams = {
  module: string
  entries: Array<DirectoryMetadata | FileMetadata>
}

interface ThumbnailDeleteJobData {
  jobId: string
}

interface ThumbnailDeleteReturnData {
  processed: Array<{ path: string }>
  errors: Array<{ path: string, error: ApiClientException<unknown> }>
}

class ThumbnailDeleteWorker extends UiWorker<ThumbnailDeleteJobParams, ThumbnailDeleteJobData, ThumbnailDeleteReturnData> {
  protected prepare() {
    return Promise.resolve({})
  }

  protected async process(context: JobContext<ThumbnailDeleteJobParams, ThumbnailDeleteJobData>) {
    const result: ThumbnailDeleteReturnData = {
      processed: [],
      errors: [],
    }
    let count = 0
    context.onProgress(0)
    for (const entry of context.params.entries) {
      if (context.abortSignal.aborted) {
        return result
      }

      try {
        if (entry.type === 'file') {
          await deleteThumbnails(
            context.apiClient,
            context.params.module,
            entry.path,
            { signal: context.abortSignal },
          )
          result.processed.push({ path: entry.path })
        }
      } catch (e) {
        if (e instanceof ApiClientException) {
          result.errors.push({ path: entry.path, error: e })
        }

        throw e
      }

      count += 1
      context.onProgress(count / context.params.entries.length)
    }

    return result
  }

  protected prepareRetry() {
    return Promise.resolve({})
  }

  protected generateName?: (params: ThumbnailDeleteJobParams) => string = (params) => params.module
}

const thumbnailDeleteWorker = new ThumbnailDeleteWorker()
export default thumbnailDeleteWorker
