import { NumberEnum, Type, type Static } from '../type-helpers.ts'

export const ThumbnailImageSchema = Type.Object({
  format: Type.String(),
  type: Type.Optional(Type.String()),
  decoder: Type.Optional(Type.String()),
  width: Type.Optional(Type.Integer()),
  height: Type.Optional(Type.Integer()),
  hasAlpha: Type.Optional(Type.Boolean()),
  rotation: Type.Optional(NumberEnum([0, 90, 180, 270])),
}, {
  title: 'ThumbnailImage',
  description: 'Represents one thumbnail image from the available thumbnails for the file',
})

export type ThumbnailImage = Static<typeof ThumbnailImageSchema>

export const ThumbnailManifestSchema = Type.Object({
  path: Type.String(),
  modificationTime: Type.String(),
  images: Type.Readonly(Type.Array(ThumbnailImageSchema)),
}, {
  title: 'ThumbnailManifest',
  description: 'Thumbnail information about the file',
})

export type ThumbnailManifest = Static<typeof ThumbnailManifestSchema>
