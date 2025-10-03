import { NotExistsException } from '../../core-logic/exceptions/index.ts'
import { info } from '../../core-logic/fs/index.ts'
import { readThumbnailManifest } from '../../core-logic/thumbnail/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Nullable, Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'
import pathWildcardParam from '../../models/fs/path-wildcard.ts'
import { ThumbnailManifestSchema } from '../../models/thumbnails/thumbnail-manifest.ts'

const schema = {
  summary: 'Gets the thumbnail manifest for the given file',
  params: Type.Object({
    appKey: applicationKeyParam,
    '*': pathWildcardParam,
  }),
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: Nullable(ThumbnailManifestSchema),
    304: { type: 'null', description: 'Information is fresh' },
    404: NotFoundApiErrorSchema,
  },
  tags: ['fs'],
}

const thumbnailManifestController: Controller<typeof schema> = async (req, reply) => {
  const path = `/${req.params['*']}`

  try {
    const metadata = await info(req.appTenant!, path)

    // TODO add caching system

    if (metadata.type !== 'file') {
      reply.send(null)
    } else {
      const manifest = await readThumbnailManifest(req.appTenant!, metadata)
      reply.send(manifest)
    }
  } catch (e) {
    if (e instanceof NotExistsException) {
      reply.callNotFound()
    } else {
      throw e
    }
  }
}

thumbnailManifestController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default thumbnailManifestController
