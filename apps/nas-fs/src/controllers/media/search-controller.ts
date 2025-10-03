import getMediaRepository from '../../core-logic/media/repository/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { SearchResultsSchema } from '../../models/media.ts'

const schema = {
  summary: 'Searches items in the library',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  querystring: Type.Object({
    query: Type.String({ minLength: 2 }),
    limit: Type.Optional(Type.Integer({ minimum: 5, maximum: 50 })),
  }),
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: SearchResultsSchema,
  },
  tags: ['media'],
}

const searchController: Controller<typeof schema> = async (req, reply) => {
  const { limit, query } = req.query
  const mediaRepository = getMediaRepository(req.appTenant!)
  if (!mediaRepository || !query) {
    reply.send({ areas: [] })
    return
  }

  reply.send(await mediaRepository.search(
    req.appTenant!,
    query,
    limit,
  ))
}

searchController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default searchController
