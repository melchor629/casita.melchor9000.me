import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'
import BadRequestError from '../../models/errors/bad-request-error.ts'
import jobIdParamSchema from '../../models/jobs/job-id.ts'
import queueNameParamSchema from '../../models/jobs/queue-name.ts'
import { RetryJobResponseSchema } from '../../models/jobs/retry-job-request.ts'

const schema = {
  summary: 'Retries a job in the queue',
  params: Type.Object({
    appKey: applicationKeyParam,
    queueName: queueNameParamSchema,
    jobId: jobIdParamSchema,
  }),
  response: {
    default: ApiErrorSchema,
    200: RetryJobResponseSchema,
    404: NotFoundApiErrorSchema,
  },
  tags: ['jobs'],
}

const retryJobController: Controller<typeof schema> = async (req, reply) => {
  const { queue } = req
  const { jobId } = req.params

  const job = await queue!.getJob(jobId)
  if (job) {
    if (await job.isFailed()) {
      await job.retry('failed')
      reply.send({ done: true })
    } else {
      throw new BadRequestError('The job is not in failed state, cannot retry')
    }
  } else {
    reply.callNotFound()
  }
}

retryJobController.options = {
  config: {
    authorization: {
      admin: true,
    },
    jwt: {},
  },
  schema,
}

export default retryJobController
