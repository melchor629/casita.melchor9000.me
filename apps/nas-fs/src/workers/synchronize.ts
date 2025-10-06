import type { Job } from 'bullmq'
import getApp from '../core-logic/app.ts'
import { directoryWalker, info } from '../core-logic/fs/index.ts'
import { queues } from '../core-logic/jobs/constants.ts'
import q from '../core-logic/jobs/queues.ts'
import type { AppJobData } from '../core-logic/jobs/types.ts'
import BaseWorker, { type TracingContext } from './base-worker.ts'

export interface SynchronizeJobData extends AppJobData {
  path: string
  recursive?: boolean
  extractImageForThumbnails?: boolean
}

const synchronizeProcessor = async (
  job: Job<SynchronizeJobData>,
  _: unknown,
  { createSpan }: TracingContext,
) => {
  const app = getApp(job.data.appIdentifier)
  if (!app) {
    throw new Error(`App ${job.data.appIdentifier} does not exist`)
  }

  const paths: string[] = []
  await createSpan('synchronize get-paths', async () => {
    for await (const [path] of await directoryWalker(app, job.data.path, job.data)) {
      paths.push(path)
    }
  })

  const errors: Array<{ path: string, error: unknown }> = []
  const filesToExtractImages: string[] = []
  let i = 0
  const updateProgressHandle = setInterval(() => void job.updateProgress((i / paths.length) * 100).catch(() => {}), 100)
  updateProgressHandle.unref()
  await createSpan('synchronize info', async () => {
    for (const path of paths) {
      try {
        const metadata = await info(app, path)

        if (job.data.extractImageForThumbnails && metadata.type === 'dir') {
          filesToExtractImages.push(path)
        }
      } catch (error) {
        errors.push({ path, error })
      }

      i += 1
    }
  })

  clearInterval(updateProgressHandle)
  await job.updateProgress(100)
  const thumbnailJobs = await Promise.all(
    filesToExtractImages.map((path) => (
      q.thumbnailQueue.add(
        path,
        { appIdentifier: job.data.appIdentifier, path },
        { parent: { id: job.id!, queue: job.queueName } },
      )
    )),
  )
  return {
    processed: paths.length - errors.length,
    total: paths.length,
    errors,
    thumbnailJobs: thumbnailJobs.map((j) => j.id),
  }
}

const synchronizeWorker = new BaseWorker(queues.synchronize, synchronizeProcessor, {
  concurrency: 1,
})

export default synchronizeWorker
