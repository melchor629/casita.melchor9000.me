import { Type, type Static } from '../type-helpers.ts'

export const RetryJobResponseSchema = Type.Object({
  done: Type.Literal(true),
}, {
  title: 'RetryJobResponse',
})

export type RetryJobResponse = Static<typeof RetryJobResponseSchema>
