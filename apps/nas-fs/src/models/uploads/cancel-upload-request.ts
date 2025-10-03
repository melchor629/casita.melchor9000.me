import { Type, type Static } from '../type-helpers.ts'

export const CancelUploadResponseSchema = Type.Object({
  done: Type.Literal(true),
}, {
  title: 'CancelUploadResponse',
  description: 'Response for cancelling the upload session',
})

export type CancelUploadResponse = Static<typeof CancelUploadResponseSchema>
