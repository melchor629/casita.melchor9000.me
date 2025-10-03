import getMediaRepository from '../../core-logic/media/repository/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { GetLibraryChildrenResponseSchema } from '../../models/media.ts'

const schema = {
  summary: 'Gets children items from a library',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: GetLibraryChildrenResponseSchema,
  },
  tags: ['media'],
}

const getLibraryChildrenController: Controller<typeof schema> = async (req, reply) => {
  const mediaRepository = getMediaRepository(req.appTenant!)
  if (!mediaRepository) {
    reply.send({ libraryType: null, items: [] })
    return
  }

  // const { filter, sort } = req.query
  const [items, libraryType] = await Promise.all([
    mediaRepository.getItemChildren(req.appTenant!),
    mediaRepository.getType(req.appTenant!),
  ])
  reply.send({
    libraryType,
    items,
  })
}

getLibraryChildrenController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default getLibraryChildrenController
