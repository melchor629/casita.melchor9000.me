import NotExistsException from '../../core-logic/exceptions/not-exists-exception.ts'
import { info } from '../../core-logic/fs/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'
import { DirectoryEntrySchema } from '../../models/fs/directory-entry.ts'
import pathWildcardParam from '../../models/fs/path-wildcard.ts'

const schema = {
  summary: 'Gets stats and metadata of a file or folder contents',
  params: Type.Object({
    appKey: applicationKeyParam,
    '*': pathWildcardParam,
  }),
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: DirectoryEntrySchema,
    304: { type: 'null', description: 'Information is fresh' },
    404: NotFoundApiErrorSchema,
  },
  tags: ['fs'],
}

const infoController: Controller<typeof schema> = async (req, reply) => {
  const path = `/${req.params['*']}`

  try {
    const { cacheMetadata, ...metadata } = await info(req.appTenant!, path)
    let isFresh = false
    if (cacheMetadata) {
      isFresh = reply.setCacheHeaders({
        etag: cacheMetadata.etag,
        lastModified: new Date(parseInt(cacheMetadata.lastModified, 10)),
        cacheControl: {
          maxAge: 10,
        },
      }).fresh
    }

    if (isFresh) {
      await reply.status(304).send()
    } else {
      await reply.send(metadata)
    }
  } catch (e) {
    if (e instanceof NotExistsException) {
      reply.callNotFound()
      return
    }

    throw e
  }
}

infoController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default infoController
