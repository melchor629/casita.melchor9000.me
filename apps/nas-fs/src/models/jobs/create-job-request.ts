import { Type, type Static } from '../type-helpers.ts'
import jobIdParamSchema from './job-id.ts'

export const CreateJobRequestSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  params: Type.Record(Type.String(), Type.Unknown()),
}, {
  title: 'CreateJobRequest',
  description: 'Create job request',
})

export type CreateJobRequest = Static<typeof CreateJobRequestSchema>

export const CreateJobResponseSchema = Type.Object({
  jobId: jobIdParamSchema,
}, {
  title: 'CreateJobResponse',
  description: 'Response for job creating',
})

export type CreateJobResponse = Static<typeof CreateJobResponseSchema>
