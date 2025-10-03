import { Type, type Static } from '../type-helpers.ts'

export const FullUploadRequestSchema = Type.Object({
  directoryPath: Type.String({
    description: 'Path where the file will be stored',
    minLength: 1,
  }),
  fileName: Type.String({
    description: 'Name of the file',
    minLength: 1,
  }),
}, {
  title: 'FullUploadRequest',
})

export type FullUploadRequest = Static<typeof FullUploadRequestSchema>
