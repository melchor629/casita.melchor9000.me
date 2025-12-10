import { createSynchronizeJob, getSynchronizeJob } from '../api/fs'
import type { SynchronizeRequest } from '../api/fs/jobs'
import type { JobState, JobWorker } from '../hooks/use-job-handler'
import * as path from './path'

type SynchronizationJobParams = SynchronizeRequest['params'] & {
  module: string
}

interface SynchronizationJobData {
  jobId: string
  module: string
}

const synchronizationWorker: JobWorker<SynchronizationJobParams, SynchronizationJobData> = {
  abort() {
    // TODO
    return Promise.resolve()
  },
  async enqueue(apiClient, { module, ...params }) {
    const { jobId } = await createSynchronizeJob(apiClient, module, {
      name: path.basename(params.path) || '/',
      params: {
        extractImageForThumbnails: params.extractImageForThumbnails,
        recursive: params.recursive,
        path: path.join('/', params.path),
      },
    })
    return {
      data: {
        jobId,
        module,
      },
      name: path.basename(params.path) || '/',
      abortable: false,
      retriable: false,
    }
  },
  retry(_apiClient, job) {
    // TODO
    return Promise.resolve(job.data)
  },
  async update(apiClient, jobs) {
    // TODO get multiple endpoint
    const jobDetails = await Promise.allSettled(
      jobs.map(({ data }) => getSynchronizeJob(apiClient, data.module, data.jobId)),
    )
    return jobDetails.map((result, i): JobState => {
      const { id } = jobs[i]
      if (result.status === 'fulfilled') {
        switch (result.value.state) {
          case 'active': return { id, state: 'processing', progress: result.value.progress / 100 }
          case 'completed': return {
            id,
            state: 'succeeded',
            resume: `Processed ${result.value.returnValue.length} entries`,
          }
          case 'failed': return {
            id,
            state: 'failed',
            message: result.value.failedReason,
            error: {
              name: 'JobError',
              message: result.value.failedReason,
              stack: result.value.stackTrace,
            },
          }
          case 'waiting': return { id, state: 'enqueued' }
          default: return { id, state: 'failed', message: `Job in ${result.value.state}` }
        }
      }

      return {
        id,
        state: 'failed',
        message: (result.reason as Error).message,
        error: result.reason as Error,
      }
    })
  },
}

export default synchronizationWorker
