import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { GetJobsResponseSchema, type GetJobsResponse } from '../../models/jobs/get-jobs-request.ts'
import jobIdParamSchema from '../../models/jobs/job-id.ts'
import queueNameParamSchema from '../../models/jobs/queue-name.ts'

const schema = {
  summary: 'Get a list of jobs from the queue',
  params: Type.Object({
    appKey: applicationKeyParam,
    queueName: queueNameParamSchema,
  }),
  querystring: Type.Object({
    jobIds: Type.Union([
      jobIdParamSchema,
      Type.Array(jobIdParamSchema),
    ]),
  }),
  response: {
    default: ApiErrorSchema,
    200: GetJobsResponseSchema,
  },
  tags: ['jobs'],
}

const getJobsController: Controller<typeof schema> = async (req, reply) => {
  const { queue } = req
  let { jobIds } = req.query

  jobIds = Array.isArray(jobIds) ? jobIds.map((v) => v) : [jobIds]

  const jobs = await Promise.all(jobIds.map((jobId) => queue!.getJob(jobId)))
  const jobsWithState = await Promise.all(jobs.map(async (job) => {
    if (job) {
      return [job.asJSON(), await job.getState()] as const
    }

    return [null, null] as const
  }))
  const response: GetJobsResponse = {
    jobs: jobsWithState.map(([jobJson, state]) => (jobJson
      ? {
        attemptsMade: jobJson.attemptsMade,
        data: JSON.parse(jobJson.data) as unknown,
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
      } satisfies GetJobsResponse['jobs'][0]
      : null)),
  }
  reply.send(response)
}

getJobsController.options = {
  config: {
    authorization: {
      admin: true,
    },
    jwt: {},
  },
  schema,
}

export default getJobsController
