import { getUrlAlias } from '../../core-logic/url-alias/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Binary, ContentResponse, Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'
import storageController from './storage.ts'

const schema = {
  summary: 'Gets the contents of the URL alias',
  params: Type.Object({
    appKey: applicationKeyParam,
    id: Type.String(),
    num: Type.Optional(Type.Integer({ minimum: 1 })),
  }),
  response: {
    default: ApiErrorSchema,
    200: ContentResponse({
      'application/octet-stream': Binary(),
    }, {
      description: 'Content for the file or directory',
    }),
    304: { type: 'null', description: 'Content is fresh' },
    404: NotFoundApiErrorSchema,
  },
  tags: ['fs'],
}

const getAliasUrlController: Controller<typeof schema> = async (req, reply) => {
  const { id, num } = req.params
  const { logger } = req.appTenant!
  logger.debug({ module: 'controllers.getAliasUrl', id, num }, 'Looking for URL alias')
  const entries = await getUrlAlias(req.appTenant!, id)

  const entry = entries?.paths[(num || 1) - 1]
  if (!entry) {
    logger.info(
      { module: 'controllers.getAliasUrl', id, num },
      'URL alias does not exist or has been already deleted',
    )
    reply.callNotFound()
    return
  }

  // @ts-expect-error lazy mode
  req.params['*'] = entry
  // @ts-expect-error lazy mode, part 2
  await storageController.call(req.server, req, reply)
}

getAliasUrlController.options = {
  config: {},
  schema,
}

export default getAliasUrlController
