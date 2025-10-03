import { Type, type Static } from '../type-helpers.ts'

export const RemoveRequestSchema = Type.Object({
  path: Type.String({
    description: 'Path to the file or directory to remove',
    examples: ['/some/dir'],
  }),
  recursive: Type.Optional(Type.Boolean({
    description: 'If removing a directory, remove the contents recursively',
  })),
}, {
  title: 'RemoveRequest',
  description: 'Remove file or folder request',
})

export type RemoveRequest = Static<typeof RemoveRequestSchema>

export const RemoveResponseSchema = Type.Object({
  done: Type.Boolean({
    description: 'Operation done',
  }),
}, {
  title: 'RemoveResponse',
  description: 'Response for remove operation completed',
})

export type RemoveResponse = Static<typeof RemoveResponseSchema>
