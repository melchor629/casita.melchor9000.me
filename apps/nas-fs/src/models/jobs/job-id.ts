import { Type } from '../type-helpers.ts'

const jobIdParamSchema = Type.String({
  description: 'The ID of a job',
  minLength: 1,
  title: 'jobId',
})

export default jobIdParamSchema
