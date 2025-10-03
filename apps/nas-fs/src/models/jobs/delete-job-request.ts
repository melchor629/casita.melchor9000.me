import { Type, type Static } from '../type-helpers.ts'

export const DeleteJobResponseSchema = Type.Object({
  done: Type.Literal(true),
}, {
  title: 'DeleteJobResponse',
})

export type DeleteJobResponse = Static<typeof DeleteJobResponseSchema>
