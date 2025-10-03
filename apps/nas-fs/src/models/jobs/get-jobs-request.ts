import { Nullable, Type, type Static } from '../type-helpers.ts'
import { GetJobResponseSchema } from './get-job-request.ts'

export const GetJobsResponseSchema = Type.Object({
  jobs: Type.Readonly(Type.Array(Nullable(GetJobResponseSchema))),
}, {
  title: 'GetJobsResponse',
  description: 'List of jobs',
})

export type GetJobsResponse = Static<typeof GetJobsResponseSchema>
