import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { CreateJobRequestSchema, CreateJobResponseSchema } from '../../models/jobs/create-job-request.ts'
import queueNameParamSchema from '../../models/jobs/queue-name.ts'

const schema = {
  summary: 'Creates a job in the queue',
  params: Type.Object({
    appKey: applicationKeyParam,
    queueName: queueNameParamSchema,
  }),
  body: CreateJobRequestSchema,
  response: {
    default: ApiErrorSchema,
    200: CreateJobResponseSchema,
  },
  tags: ['jobs'],
}

const createJobController: Controller<typeof schema> = async (req, reply) => {
  const { queue } = req
  const job = await queue!.add(req.body.name, {
    ...req.body.params,
    appIdentifier: req.appTenant!.identifier,
  } as never)
  reply.send({ jobId: job.id! })
}

createJobController.options = {
  config: {
    authorization: {
      admin: true,
    },
    jwt: {},
  },
  schema,
}

export default createJobController
