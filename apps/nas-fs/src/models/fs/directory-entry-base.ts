import { StringEnum, Type, type Static } from '../type-helpers.ts'
import { StatSchema } from './stat.ts'

export const DirectoryEntryTypeSchema = StringEnum([
  'dir', 'file', 'symlink', 'block-dev', 'char-dev', 'socket', 'fifo', 'unknown',
], {
  title: 'DirectoryEntryType',
  description: 'Directory entry type',
})

export type DirectoryEntryType = Static<typeof DirectoryEntryTypeSchema>

export const DirectoryEntryBaseSchema = Type.Object({
  path: Type.String({
    description: 'Path to the directory entry',
  }),
  realPath: Type.String({
    description: 'Full path from file system to the directory entry',
  }),
  stat: StatSchema,
  hidden: Type.Boolean({
    description: 'Whether the file is treated as hidden or not',
  }),
}, {
  title: 'DirectoryEntryBase',
  description: 'Base type for directory entries',
})

/** Base type for directory entries */
export type DirectoryEntryBase = Static<typeof DirectoryEntryBaseSchema> & {
  type: DirectoryEntryType
}
