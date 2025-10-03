import { Type, type Static } from '../type-helpers.ts'
import { DirectoryEntryBaseSchema } from './directory-entry-base.ts'

export const BlockDevSchema = Type.Interface([
  DirectoryEntryBaseSchema,
], {
  type: Type.Literal('block-dev'),
}, { title: 'BlockDev' })

export type BlockDev = Static<typeof BlockDevSchema>
