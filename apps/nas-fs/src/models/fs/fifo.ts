import { Type, type Static } from '../type-helpers.ts'
import { DirectoryEntryBaseSchema } from './directory-entry-base.ts'

export const FIFOSchema = Type.Interface([
  DirectoryEntryBaseSchema,
], {
  type: Type.Literal('fifo'),
}, { title: 'FIFO' })

export type FIFO = Static<typeof FIFOSchema>
