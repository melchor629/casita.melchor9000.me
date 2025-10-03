import { Type, type Static } from '../type-helpers.ts'

export const MoveRequestSchema = Type.Object({
  newPath: Type.String({
    description: 'Path to move the file or directory to',
    examples: ['/some/new-dir'],
  }),
  path: Type.String({
    description: 'Path to the file or directory to move',
    examples: ['/some/new-dir'],
  }),
}, {
  title: 'MoveRequest',
  description: 'Tells to move or rename (or both) an entry from one place to another',
})

export type MoveRequest = Static<typeof MoveRequestSchema>

export const MoveResponseSchema = Type.Object({
  done: Type.Boolean({
    description: 'Operation done',
  }),
  path: Type.String({
    description: 'Path where the file or directory has been moved to',
    examples: ['/some/new-dir'],
  }),
}, {
  title: 'MoveResponse',
  description: 'Response for move operation completed',
})

export type MoveResponse = Static<typeof MoveResponseSchema>
