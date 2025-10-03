import { Type, type Static } from '../type-helpers.ts'

export const MimeSchema = Type.Object({
  mime: Type.String(),
  isText: Type.Boolean(),
}, {
  title: 'Mime',
  description: 'MIME type guess (derived from extension or from libmagic)',
})

export type Mime = Static<typeof MimeSchema>
