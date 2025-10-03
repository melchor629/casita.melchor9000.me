import { AudioTagsSchema } from '../audio-tags.ts'
import { ImageTagsSchema } from '../exif.ts'
import { MediaInfoSchema } from '../mediainfo.ts'
import { Type, type Static } from '../type-helpers.ts'
import { DirectoryEntryBaseSchema } from './directory-entry-base.ts'
import { MimeSchema } from './mime.ts'

export const FileSchema = Type.Interface([
  DirectoryEntryBaseSchema,
], {
  type: Type.Literal('file'),
  mime: Type.Optional(MimeSchema),
  mediainfo: Type.Optional(MediaInfoSchema),
  audioTags: Type.Optional(AudioTagsSchema),
  exif: Type.Optional(ImageTagsSchema),
}, { title: 'File' })

export type File = Static<typeof FileSchema>
