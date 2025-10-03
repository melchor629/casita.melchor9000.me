import { Nullable, StringEnum, Type, type Static } from './type-helpers.ts'

const ImageFileTagsSchema = Type.Object({
  fileType: Type.Readonly(StringEnum(['TIFF', 'JPEG', 'PNG', 'HEIC', 'AVIF', 'WebP', 'GIF', 'unknown'])),
  bitsPerSample: Type.Readonly(Type.Optional(Type.String())),
  width: Type.Readonly(Type.Optional(Type.String())),
  height: Type.Readonly(Type.Optional(Type.String())),
  components: Type.Readonly(Type.Optional(Type.String())),
  subsampling: Type.Readonly(Type.Optional(Type.String())),
}, { title: 'ImageFileTags' })

export type ImageFileTags = Static<typeof ImageFileTagsSchema>

const ImageExifTagsSchema = Type.Object({
  cameraMaker: Type.Readonly(Type.Optional(Type.String())),
  cameraModel: Type.Readonly(Type.Optional(Type.String())),
  orientation: Type.Readonly(Type.Optional(Type.String())),
  software: Type.Readonly(Type.Optional(Type.String())),
  artist: Type.Readonly(Type.Optional(Type.String())),
  copyright: Type.Readonly(Type.Optional(Type.String())),
  exposureTime: Type.Readonly(Type.Optional(Type.String())),
  exposureMode: Type.Readonly(Type.Optional(Type.String())),
  aperture: Type.Readonly(Type.Optional(Type.String())),
  iso: Type.Readonly(Type.Optional(Type.Union([Type.Number(), Type.Array(Type.Number())]))),
  flash: Type.Readonly(Type.Optional(Type.String())),
  focalLength: Type.Readonly(Type.Optional(Type.String())),
  whiteBalance: Type.Readonly(Type.Optional(Type.String())),
  lensMaker: Type.Readonly(Type.Optional(Type.String())),
  lensModel: Type.Readonly(Type.Optional(Type.String())),
}, { title: 'ImageExifTags' })

export type ImageExifTags = Static<typeof ImageExifTagsSchema>

export const ImageGpsTagsSchema = Type.Object({
  latitude: Type.Readonly(Nullable(Type.Number())),
  longitude: Type.Readonly(Nullable(Type.Number())),
  altitude: Type.Readonly(Nullable(Type.Number())),
}, { title: 'ImageGpsTags' })

export type ImageGpsTags = Static<typeof ImageGpsTagsSchema>

export const ImageTagsSchema = Type.Object({
  file: Type.Readonly(Nullable(ImageFileTagsSchema)),
  exif: Type.Readonly(Nullable(ImageExifTagsSchema)),
  gps: Type.Readonly(Nullable(ImageGpsTagsSchema)),
}, {
  title: 'ImageTags',
  description: 'Exif (or similar) tags from the image',
})

export type ImageTags = Static<typeof ImageTagsSchema>
