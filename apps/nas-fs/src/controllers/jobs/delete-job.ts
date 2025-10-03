import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'
import { DeleteJobResponseSchema } from '../../models/jobs/delete-job-request.ts'
import jobIdParamSchema from '../../models/jobs/job-id.ts'
import queueNameParamSchema from '../../models/jobs/queue-name.ts'

const schema = {
  summary: 'Deletes a job from the queue',
  params: Type.Object({
    appKey: applicationKeyParam,
    queueName: queueNameParamSchema,
    jobId: jobIdParamSchema,
  }),
  response: {
    default: ApiErrorSchema,
    200: DeleteJobResponseSchema,
    404: NotFoundApiErrorSchema,
  },
  tags: ['jobs'],
}

const deleteJobController: Controller<typeof schema> = async (req, reply) => {
  const { queue } = req
  const { jobId } = req.params

  const job = await queue!.getJob(jobId)
  if (job) {
    await job.remove()
    reply.send({ done: true })
  } else {
    reply.callNotFound()
  }
}

deleteJobController.options = {
  config: {
    authorization: {
      admin: true,
    },
    jwt: {},
  },
  schema,
}

export default deleteJobController
