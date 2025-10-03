import etag from 'etag'
import { NotExistsException } from '../../core-logic/exceptions/index.ts'
import { info } from '../../core-logic/fs/index.ts'
import { getThumbnail } from '../../core-logic/thumbnail/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Binary, ContentResponse, StringEnum, Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'
import pathWildcardParam from '../../models/fs/path-wildcard.ts'

const schema = {
  summary: 'Gets a thumbnail for a file',
  params: Type.Object({
    appKey: applicationKeyParam,
    '*': pathWildcardParam,
  }),
  querystring: Type.Object({
    i: Type.Optional(Type.Integer()),
    format: Type.Optional(StringEnum(['jpg', 'png', 'webp', 'avif'])),
    size: Type.Optional(StringEnum(['xsm', 'sm', 'md', 'lg', 'xlg', 'original'])),
  }),
  response: {
    default: ApiErrorSchema,
    200: ContentResponse({
      'image/*': Binary(),
    }, { description: 'Thumbnail image' }),
    304: { type: 'null', description: 'Information is fresh' },
    404: NotFoundApiErrorSchema,
  },
  tags: ['fs'],
}

const thumbnailController: Controller<typeof schema> = async (req, reply) => {
  const path = `/${req.params['*']}`
  const { format, i, size } = req.query

  try {
    const metadata = await info(req.appTenant!, path)

    if (metadata.type !== 'file') {
      reply.callNotFound()
      return
    }

    const [image, manifest] = await getThumbnail(
      req.appTenant!,
      metadata,
      size || 'md',
      i || 0,
      format || 'jpg',
    )
    if (!image) {
      reply.status(404).send()
    } else {
      const { fresh } = reply.setCacheHeaders({
        etag: etag(image.data),
        lastModified: new Date(manifest.modificationTime),
        cacheControl: {
          maxAge: 86400,
        },
      })
      reply.header('Content-Type', image.format)
      if (fresh) {
        reply.status(304).send()
      } else {
        await reply.send(image.data)
      }
    }
  } catch (e) {
    if (e instanceof NotExistsException) {
      reply.callNotFound()
    } else {
      throw e
    }
  }
}

thumbnailController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default thumbnailController
