import { pathPrefix } from '../../config.ts'
import { info } from '../../core-logic/fs/index.ts'
import { createUrlAlias } from '../../core-logic/url-alias/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import BadRequestError from '../../models/errors/bad-request-error.ts'
import type { DirectoryEntry } from '../../models/fs/directory-entry.ts'
import { UrlAliasRequestSchema, UrlAliasResponseSchema } from '../../models/url-alias/alias-request.ts'

const schema = {
  summary: 'Create an URL alias for the given existing paths',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  consumes: ['application/json'],
  produces: ['application/json'],
  body: UrlAliasRequestSchema,
  response: {
    default: ApiErrorSchema,
    201: {
      content: {
        'application/json': { schema: UrlAliasResponseSchema },
      },
      headers: {
        Location: Type.String({ format: 'uri' }),
      },
      description: 'Response for URL alias creation',
    },
  },
  tags: ['fs'],
}

const createAliasUrlController: Controller<typeof schema> = async (req, reply) => {
  const { logger } = req.appTenant!
  const { paths } = req.body

  logger.debug({ module: 'controllers.createAliasUrl' }, 'Getting paths info for request')
  const results = await Promise.allSettled(paths.map((p) => info(req.appTenant!, p)))
  const entries = results
    .filter((r): r is PromiseFulfilledResult<DirectoryEntry> => r.status === 'fulfilled')
    .map((r) => r.value)

  if (entries.length === 0) {
    throw new BadRequestError('All paths do no exist, cannot create URL alias')
  }

  logger.debug({ module: 'controllers.createAliasUrl' }, 'Generating alias for paths')
  const id = await createUrlAlias(req.appTenant!, entries)
  const urlAlias = `${pathPrefix || ''}/${req.appTenant!.identifier}/a/${id}`
  reply
    .status(201)
    .header('Location', urlAlias)
    .send({
      id,
      url: urlAlias,
      urls: Object.fromEntries(
        entries.map((e, i) => [
          e.path.startsWith('/') ? e.path : `/${e.path}`,
          `${urlAlias}/${i + 1}`,
        ]),
      ),
    })
}

createAliasUrlController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default createAliasUrlController
