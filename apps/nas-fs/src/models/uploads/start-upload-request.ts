import { Type, type Static } from '../type-helpers.ts'

export const StartUploadRequestSchema = Type.Object({
  directoryPath: Type.String({
    description: 'Path where the file will be stored',
    minLength: 1,
  }),
  fileName: Type.String({
    description: 'Name of the file',
    minLength: 1,
  }),
  uploadToken: Type.Optional(Type.String({
    description: 'If provided, resumes the upload with the given token',
    minLength: 30,
    maxLength: 30,
  })),
}, {
  title: 'StartUploadRequest',
  description: 'Start upload request',
})

export type StartUploadRequest = Static<typeof StartUploadRequestSchema>

export const StartUploadResponseSchema = Type.Object({
  uploadToken: Type.String({
    description: 'The token for the upload session',
    minLength: 30,
    maxLength: 30,
  }),
  startPosition: Type.Number({
    description: 'The position where the session will start writing data (initially 0, resume can be any value)',
    minimum: 0,
  }),
}, {
  title: 'StartUploadResponse',
  description: 'Response for the upload session',
})

export type StartUploadResponse = Static<typeof StartUploadResponseSchema>
