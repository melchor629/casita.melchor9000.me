import getMediaRepository from '../../core-logic/media/repository/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { GetItemResponseSchema, mediaItemKeyParamSchema } from '../../models/media.ts'

const schema = {
  summary: 'Get all metadata from a specific item',
  params: Type.Object({
    appKey: applicationKeyParam,
    key: mediaItemKeyParamSchema,
  }),
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: GetItemResponseSchema,
    404: Type.Null({ description: 'Item does not exist' }),
  },
  tags: ['media'],
}

const getItemController: Controller<typeof schema> = async (req, reply) => {
  const mediaRepository = getMediaRepository(req.appTenant!)
  if (!mediaRepository) {
    reply.status(404).send(null)
    return
  }

  const { key } = req.params
  const item = await mediaRepository.getItem(req.appTenant!, key)
  if (item) {
    reply.send(item)
  } else {
    reply.status(404).send(null)
  }
}

getItemController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default getItemController
