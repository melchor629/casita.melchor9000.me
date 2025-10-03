import { Type, type Static } from '../type-helpers.ts'

export const DoUploadResponseSchema = Type.Object({
  bytesWritten: Type.Number({
    description: 'Number of bytes written back in the file (it might be less than provided)',
    minimum: 0,
  }),
  position: Type.Number({
    description: 'Position of the file after the writing',
    minimum: 0,
  }),
}, {
  title: 'DoUploadResponse',
  description: 'Response for uploading a part',
})

export type DoUploadResponse = Static<typeof DoUploadResponseSchema>
