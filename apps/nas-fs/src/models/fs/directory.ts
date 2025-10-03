import { Type, type Static } from '../type-helpers.ts'
import { DirectoryEntryBaseSchema, DirectoryEntryTypeSchema } from './directory-entry-base.ts'
import { MimeSchema } from './mime.ts'

const DirectoryChildEntrySchema = Type.Interface([
  DirectoryEntryBaseSchema,
], {
  type: DirectoryEntryTypeSchema,
  mime: Type.Optional(MimeSchema),
}, { title: 'DirectoryChildEntry' })

export const DirectorySchema = Type.Interface([
  DirectoryEntryBaseSchema,
], {
  type: Type.Literal('dir'),
  contents: Type.Array(DirectoryChildEntrySchema),
}, { title: 'Directory' })

export type Directory = Static<typeof DirectorySchema>
