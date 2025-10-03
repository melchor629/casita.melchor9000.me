import getMediaRepository from '../../core-logic/media/repository/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { GetItemChildrenResponseSchema, mediaItemKeyParamSchema } from '../../models/media.ts'

const schema = {
  summary: 'Gets children items from an item',
  params: Type.Object({
    appKey: applicationKeyParam,
    key: mediaItemKeyParamSchema,
  }),
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: GetItemChildrenResponseSchema,
  },
  tags: ['media'],
}

const getItemChildrenController: Controller<typeof schema> = async (req, reply) => {
  const mediaRepository = getMediaRepository(req.appTenant!)
  if (!mediaRepository) {
    reply.send({ items: [] })
    return
  }

  const { key } = req.params
  // const { filter, sort } = req.query
  const items = await mediaRepository.getItemChildren(req.appTenant!, key)
  reply.send({
    items,
  })
}

getItemChildrenController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default getItemChildrenController
