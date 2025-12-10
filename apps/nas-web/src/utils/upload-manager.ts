import type { ApiClient } from '../api/api-client'
import {
  cancelUpload, doUpload, endUpload, resumeUpload, startUpload,
} from '../api/fs'
import type { Job } from '../hooks/use-job-handler'
import { humanBytes } from './number-format'
import * as path from './path'
import UiWorker, { type JobContext } from './ui-worker'

interface UploadRequest {
  module: string
  directoryPath: string
  file: File
}

interface UploadData {
  jobId: string
  uploadToken: string
  startPosition?: number
}

// the size of each chunk of data uploaded to the server
const chunkSize = 10 * 1000 * 1000

class UploadWorker extends UiWorker<UploadRequest, UploadData> {
  protected async prepare(apiClient: ApiClient, params: UploadRequest) {
    const { uploadToken } = await startUpload(
      apiClient,
      params.module,
      path.join('/', params.directoryPath),
      params.file.name,
    )
    return { uploadToken }
  }

  protected async process(context: JobContext<UploadRequest, UploadData>): Promise<void> {
    let bytesSent = context.data.startPosition ?? 0
    let chunk = context.params.file.slice(bytesSent, bytesSent + chunkSize)
    const fileSize = context.params.file.size
    while (bytesSent < context.params.file.size) {
      const percentage = bytesSent / fileSize
      const percentageDescription = `${humanBytes(bytesSent)} / ${humanBytes(fileSize)}`
      context.onProgress({ value: percentage, description: percentageDescription })

      const { bytesWritten, position } = await doUpload(
        context.apiClient,
        context.params.module,
        context.data.uploadToken,
        chunk,
        context.abortSignal,
      )
      bytesSent += bytesWritten

      if (context.abortSignal.aborted) {
        await cancelUpload(context.apiClient, context.params.module, context.data.uploadToken)
        return
      }
      chunk = context.params.file.slice(position, position + chunkSize)
    }

    context.onProgress({ value: 1, description: humanBytes(fileSize) })
    await endUpload(context.apiClient, context.params.module, context.data.uploadToken)
  }

  protected async prepareRetry(apiClient: ApiClient, job: Job<UploadData>, params: UploadRequest): Promise<Omit<UploadData, 'jobId'>> {
    const { startPosition } = await resumeUpload(
      apiClient,
      params.module,
      path.join('/', params.directoryPath),
      params.file.name,
      job.data.uploadToken,
    )
    return { uploadToken: job.data.uploadToken, startPosition }
  }

  protected generateName?: ((params: UploadRequest) => string) | undefined = (params) => `(${params.module}) ${params.file.name}`
}

const uploadWorker = new UploadWorker()
export default uploadWorker
