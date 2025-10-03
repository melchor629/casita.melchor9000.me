import { NotExistsException } from '../../core-logic/exceptions/index.ts'
import { info } from '../../core-logic/fs/index.ts'
import { deleteThumbnailManifest } from '../../core-logic/thumbnail/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'
import BadRequestError from '../../models/errors/bad-request-error.ts'
import pathWildcardParam from '../../models/fs/path-wildcard.ts'
import { ThumbnailDeleteResponseSchema } from '../../models/thumbnails/thumbnail-delete-request.ts'

const schema = {
  summary: 'Deletes all thumbnails for the given file',
  params: Type.Object({
    appKey: applicationKeyParam,
    '*': pathWildcardParam,
  }),
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: ThumbnailDeleteResponseSchema,
    404: NotFoundApiErrorSchema,
  },
  tags: ['fs'],
}

const thumbnailDeleteController: Controller<typeof schema> = async (req, reply) => {
  const path = `/${req.params['*']}`

  try {
    const metadata = await info(req.appTenant!, path)
    if (metadata.type !== 'file') {
      throw new BadRequestError('Path does not point to a file')
    }

    await deleteThumbnailManifest(req.appTenant!, metadata)
    reply.send({ done: true })
  } catch (e) {
    if (e instanceof NotExistsException) {
      reply.callNotFound()
    } else {
      throw e
    }
  }
}

thumbnailDeleteController.options = {
  config: {
    authorization: {
      admin: true,
    },
    jwt: {},
  },
  schema,
}

export default thumbnailDeleteController
