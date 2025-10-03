import { Type } from '../type-helpers.ts'

const queueNameParamSchema = Type.String({
  description: 'Name of the job queue',
  minLength: 2,
  title: 'queueName',
})

export default queueNameParamSchema
