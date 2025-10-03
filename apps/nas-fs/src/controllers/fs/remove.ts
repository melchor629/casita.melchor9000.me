import { NotExistsException } from '../../core-logic/exceptions/index.ts'
import { remove } from '../../core-logic/fs/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import BadRequestError from '../../models/errors/bad-request-error.ts'
import { RemoveRequestSchema, RemoveResponseSchema } from '../../models/fs/remove-request.ts'

const schema = {
  summary: 'Removes an entry',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  consumes: ['application/json'],
  produces: ['application/json'],
  body: RemoveRequestSchema,
  response: {
    default: ApiErrorSchema,
    200: RemoveResponseSchema,
  },
  tags: ['fs'],
}

const removeController: Controller<typeof schema> = async (req, reply) => {
  try {
    const { path, recursive } = req.body
    await remove(req.appTenant!, path, recursive)
    reply.send({ done: true })
  } catch (e) {
    if (e instanceof NotExistsException) {
      throw new BadRequestError('The path must exist', 'path')
    } else {
      throw e
    }
  }
}

removeController.options = {
  config: {
    authorization: {
      write: true,
      delete: true,
    },
    jwt: {},
  },
  schema,
}

export default removeController
