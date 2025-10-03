import logger from './logger.ts'

const start = async () => {
  logger.info('Loading workers...')
  const workers = await import('./core-logic/jobs/workers/index.ts')
  const { default: queues } = await import('./core-logic/jobs/queues.ts')

  logger.info({ workers: Object.keys(workers) }, 'Starting workers...')

  const job1 = await queues.thumbnailCleanerQueue.add('daily-cleanup', {}, { repeat: { pattern: '15 0 * * *' } })
  logger.info({ jobId: job1.id }, 'Scheduled repeatable job for thumbnail-cleaner')
  const job2 = await queues.uploadCleanerQueue.add('daily-cleanup', {}, { repeat: { pattern: '20 0 * * *' } })
  logger.info({ jobId: job2.id }, 'Scheduled repeatable job for upload-cleaner')
}

export default start
