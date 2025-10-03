import { Type, type Static } from '../type-helpers.ts'
import { BlockDevSchema } from './block-dev.ts'
import { CharDevSchema } from './char-dev.ts'
import { DirectoryEntryBaseSchema, type DirectoryEntryBase } from './directory-entry-base.ts'
import { DirectorySchema } from './directory.ts'
import { FIFOSchema } from './fifo.ts'
import { FileSchema } from './file.ts'
import { SocketSchema } from './socket.ts'
import { SymlinkSchema } from './symbolic-link.ts'

export interface GenericDirectoryEntry extends DirectoryEntryBase {
  type: 'unknown'
}

export const DirectoryEntrySchema = Type.Union([
  DirectorySchema,
  FileSchema,
  SymlinkSchema,
  BlockDevSchema,
  CharDevSchema,
  SocketSchema,
  FIFOSchema,
  Type.Interface([DirectoryEntryBaseSchema], { type: Type.Literal('unknown') }, { title: 'UnknownDirectoryEntry' }),
], {
  title: 'DirectoryEntry',
  description: 'A directory entry information',
})

export type DirectoryEntry = Static<typeof DirectoryEntrySchema>
