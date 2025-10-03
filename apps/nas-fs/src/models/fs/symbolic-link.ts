import { Nullable, Type, type Static } from '../type-helpers.ts'
import { DirectoryEntryBaseSchema } from './directory-entry-base.ts'

export const SymlinkSchema = Type.Interface([
  DirectoryEntryBaseSchema,
], {
  type: Type.Literal('symlink'),
  value: Type.String({
    description: 'The value of the symbolic link',
  }),
  target: Nullable(Type.String({
    description: 'If the value points to an entry in the same app, this property will be filled with the path pointing at it',
  })),
}, { title: 'Symlink' })

export type Symlink = Static<typeof SymlinkSchema>
