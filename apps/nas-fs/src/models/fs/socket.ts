import { Type, type Static } from '../type-helpers.ts'
import { DirectoryEntryBaseSchema } from './directory-entry-base.ts'

export const SocketSchema = Type.Interface([
  DirectoryEntryBaseSchema,
], {
  type: Type.Literal('socket'),
}, { title: 'Socket' })

export type Socket = Static<typeof SocketSchema>
