import { StringEnum, Type, type Static } from './type-helpers.ts'

export const MediaInfoTrackSchema = Type.Object({
  '@type': StringEnum(['General', 'Video', 'Audio', 'Text', 'Image', 'Chapters', 'Menu']),
  // eslint-disable-next-line no-template-curly-in-string
  '@typeorder': Type.Optional(Type.TemplateLiteral('${number}')),
  extra: Type.Optional(Type.Record(Type.String(), Type.String())),
}, {
  additionalProperties: Type.String(),
  title: 'MediaInfoTrack',
  description: 'Mediainfo track information',
})

export type MediaInfoTrack = Static<typeof MediaInfoTrackSchema> & Record<string, string>

export const MediaInfoSchema = Type.Object({
  creatingLibrary: Type.Object({
    name: Type.String(),
    version: Type.String(),
    url: Type.String({ format: 'uri' }),
  }),
  media: Type.Object({
    '@ref': Type.String(),
    track: Type.Array(MediaInfoTrackSchema),
  }),
}, {
  title: 'MediaInfo',
  description: 'Mediainfo from the media file',
})

export type MediaInfo = Static<typeof MediaInfoSchema>
