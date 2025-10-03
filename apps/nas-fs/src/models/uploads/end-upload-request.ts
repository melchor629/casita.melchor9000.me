import { Type, type Static } from '../type-helpers.ts'

export const EndUploadResponseSchema = Type.Object({
  path: Type.String({
    description: 'The path to the file that has been uploaded',
    minLength: 1,
  }),
}, {
  title: 'EndUploadResponse',
  description: 'Response for ending the upload session',
})

export type EndUploadResponse = Static<typeof EndUploadResponseSchema>
