import { Type, type Static } from '../type-helpers.ts'

export const ThumbnailDeleteResponseSchema = Type.Object({
  done: Type.Boolean({ description: 'Operation done' }),
}, {
  title: 'ThumbnailDeleteResponse',
  description: 'Result of the delete thumbnails operation',
})

export type ThumbnailDeleteResponse = Static<typeof ThumbnailDeleteResponseSchema>
