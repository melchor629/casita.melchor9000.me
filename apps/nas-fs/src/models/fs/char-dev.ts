import { Type, type Static } from '../type-helpers.ts'
import { DirectoryEntryBaseSchema } from './directory-entry-base.ts'

export const CharDevSchema = Type.Interface([
  DirectoryEntryBaseSchema,
], {
  type: Type.Literal('char-dev'),
}, { title: 'CharDev' })

export type CharDev = Static<typeof CharDevSchema>
