import getMediaRepository from '../../core-logic/media/repository/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { GetRecentlyAddedResponseSchema } from '../../models/media.ts'

const schema = {
  summary: 'Gets a list of recently added media for the library',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: GetRecentlyAddedResponseSchema,
  },
  tags: ['media'],
}

const getRecentlyAddedController: Controller<typeof schema> = async (req, reply) => {
  const mediaRepository = getMediaRepository(req.appTenant!)
  if (!mediaRepository) {
    reply.send({ items: [], libraryType: null })
    return
  }

  const [items, libraryType] = await Promise.all([
    mediaRepository.getRecentlyAdded(req.appTenant!),
    mediaRepository.getType(req.appTenant!),
  ])
  reply.send({
    items,
    libraryType,
  })
}

getRecentlyAddedController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default getRecentlyAddedController
