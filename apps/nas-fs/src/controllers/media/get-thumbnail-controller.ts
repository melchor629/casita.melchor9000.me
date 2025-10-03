import getMediaRepository from '../../core-logic/media/repository/index.ts'
import getMediaThumbnail from '../../core-logic/media/thumbnail-processor.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Binary, ContentResponse, Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { mediaItemKeyParamSchema, mediaItemThumbnailKeyParamSchema } from '../../models/media.ts'

const schema = {
  summary: 'Gets the thumbnail for the item',
  params: Type.Object({
    appKey: applicationKeyParam,
    key: mediaItemKeyParamSchema,
    thumbnailKey: mediaItemThumbnailKeyParamSchema,
  }),
  headers: Type.Object({
    accept: Type.Optional(Type.String({
      examples: ['image/webp', 'image/avif', 'image/jpeg', 'image/png'],
      default: 'image/jpeg',
    })),
  }),
  querystring: Type.Object({
    w: Type.Optional(Type.Integer({ minimum: 100, maximum: 5_000 })),
    h: Type.Optional(Type.Integer({ minimum: 100, maximum: 5_000 })),
    original: Type.Optional(Type.Boolean()),
  }),
  response: {
    default: ApiErrorSchema,
    200: ContentResponse({
      'image/jpeg': Binary(),
      'image/png': Binary(),
      'image/webp': Binary(),
      'image/avif': Binary(),
      'image/*': Binary(),
    }, {
      description: 'Item thumbnail',
    }),
    404: Type.Null({ description: 'Item does not exist or does not have a thumbnail' }),
  },
  tags: ['media'],
}

const getThumbnailController: Controller<typeof schema> = async (req, reply) => {
  const mediaRepository = getMediaRepository(req.appTenant!)
  if (!mediaRepository) {
    return reply.status(404).send()
  }

  const { key, thumbnailKey } = req.params
  const { h: height, original, w: width } = req.query
  const acceptTypes = req.headers.accept?.split(',') || ['image/jpeg']

  const format = acceptTypes
    .map((type) => {
      if (type.startsWith('image/webp')) {
        return 'webp'
      }

      if (type.startsWith('image/avif')) {
        return 'avif'
      }

      if (type.startsWith('image/png')) {
        return 'png'
      }

      if (type.startsWith('image/*')) {
        return 'jpeg'
      }

      return undefined
    })
    .find((t) => t)

  const result = await getMediaThumbnail(req.appTenant!, mediaRepository, {
    mediaKey: key,
    thumbnailKey,
    format,
    size: original ? 'original' : (width && height && [width, height]) || undefined,
  })
  if (result) {
    reply
      .header('content-type', result.contentType)
      .header('cache-control', result.cacheControl === 'no-cache'
        ? 'max-age=86400'
        : result.cacheControl)
    if ('data' in result) {
      return reply.send(result.data)
    }

    return reply.sendFile(result.path, { acceptRanges: false })
  }

  return reply.status(404).send()
}

getThumbnailController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default getThumbnailController
