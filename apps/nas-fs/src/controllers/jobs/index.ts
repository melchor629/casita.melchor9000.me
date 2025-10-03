import type { FastifyInstance } from 'fastify'
import queues from '../../core-logic/jobs/queues.ts'
import createJobController from './create-job.ts'
import deleteJobController from './delete-job.ts'
import getJobController from './get-job.ts'
import getJobsController from './get-jobs.ts'
import retryJobController from './retry-job.ts'

declare module 'fastify' {
  interface FastifyRequest {
    queue?: (typeof queues)[keyof typeof queues]
  }
}

const jobsRoutesPlugin = (app: FastifyInstance) => {
  app.decorateRequest('queue')
  app.addHook<{ Params: { queueName: string } }>('onRequest', (req, reply, done) => {
    const { queueName } = req.params
    const varName = `${queueName}Queue` as keyof typeof queues
    if (varName in queues) {
      req.queue = queues[varName]
    } else {
      reply.callNotFound()
    }
    done()
  })
  app
    .put('/:queueName', createJobController.options, createJobController)
    .get('/:queueName/jobs', getJobsController.options, getJobsController)
    .get('/:queueName/:jobId', getJobController.options, getJobController)
    .delete('/:queueName/:jobId', deleteJobController.options, deleteJobController)
    .post('/:queueName/:jobId/retry', retryJobController.options, retryJobController)

  return Promise.resolve()
}

export default jobsRoutesPlugin
