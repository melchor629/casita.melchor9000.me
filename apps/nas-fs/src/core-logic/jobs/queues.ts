import { Queue, type WorkerOptions } from 'bullmq'
import { redisUrl } from '../../config.ts'
import { addCloseableHandler } from '../../utils/stop-signal.ts'
import { queues as queueNames, redisPrefix } from './constants.ts'
import type { SynchronizeJobData } from './workers/synchronize.ts'
import type { ThumbnailCleanerJobData } from './workers/thumbnail-cleaner.ts'
import type { ThumbnailJobData } from './workers/thumbnail.ts'
import type { UploadCleanerJobData } from './workers/upload-cleaner.ts'

const redisUrlUrl = new URL(redisUrl!)

const settings: WorkerOptions = {
  connection: {
    host: redisUrlUrl.host,
    port: redisUrlUrl.port ? parseInt(redisUrlUrl.port, 10) : undefined,
    db: parseInt(redisUrlUrl.pathname.substring(1) || '0', 10),
    username: redisUrlUrl.username,
    password: redisUrlUrl.password,
    enableOfflineQueue: false,
    retryStrategy: (times) => Math.max(Math.min(Math.exp(times), 20_000), 500),
    maxRetriesPerRequest: 3,
  },
  prefix: redisPrefix,
}

const thumbnailQueue = new Queue<ThumbnailJobData>(queueNames.thumbnail, settings)
const synchronizeQueue = new Queue<SynchronizeJobData>(queueNames.synchronize, settings)
const thumbnailCleanerQueue = new Queue<ThumbnailCleanerJobData>(
  queueNames.thumbnailCleaner,
  settings,
)
const uploadCleanerQueue = new Queue<UploadCleanerJobData>(queueNames.uploadCleaner, settings)

const queues = Object.freeze({
  thumbnailQueue,
  synchronizeQueue,
  thumbnailCleanerQueue,
  uploadCleanerQueue,
})

for (const queue of Object.values(queues)) {
  queue.on('error', () => {})
  addCloseableHandler(`bullmq:queue:${queue.name}`, () => queue.close().catch(() => queue.disconnect()))
}

export default queues
