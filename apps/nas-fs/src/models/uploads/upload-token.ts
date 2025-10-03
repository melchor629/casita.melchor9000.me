import { Type } from '../type-helpers.ts'

const uploadTokenSchema = Type.String({
  title: 'uploadToken',
  description: 'The upload token for the session',
  minLength: 30,
  maxLength: 30,
})

export default uploadTokenSchema
