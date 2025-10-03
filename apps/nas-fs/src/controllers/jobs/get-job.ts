import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'
import { GetJobResponseSchema } from '../../models/jobs/get-job-request.ts'
import jobIdParamSchema from '../../models/jobs/job-id.ts'
import queueNameParamSchema from '../../models/jobs/queue-name.ts'

const schema = {
  summary: 'Gets a job from the queue',
  params: Type.Object({
    appKey: applicationKeyParam,
    queueName: queueNameParamSchema,
    jobId: jobIdParamSchema,
  }),
  response: {
    default: ApiErrorSchema,
    200: GetJobResponseSchema,
    404: NotFoundApiErrorSchema,
  },
  tags: ['jobs'],
}

const getJobController: Controller<typeof schema> = async (req, reply) => {
  const { queue } = req
  const { jobId } = req.params

  const job = await queue!.getJob(jobId)
  if (job) {
    const state = await job.getState()
    const jobJson = job.asJSON()
    reply.send({
      attemptsMade: jobJson.attemptsMade,
      data: JSON.parse(jobJson.data),
      failedReason: jobJson.failedReason,
      finishedOn: jobJson.finishedOn,
      id: jobJson.id,
      name: jobJson.name,
      processedOn: jobJson.processedOn,
      progress: jobJson.progress as number,
      stackTrace: JSON.parse(jobJson.stacktrace) as unknown[],
      returnValue: JSON.parse(jobJson.returnvalue) as unknown,
      timestamp: jobJson.timestamp,
      state,
    })
  } else {
    reply.callNotFound()
  }
}

getJobController.options = {
  config: {
    authorization: {
      admin: true,
    },
    jwt: {},
  },
  schema,
}

export default getJobController
