import { AlreadyExistsException, NotExistsException } from '../../core-logic/exceptions/index.ts'
import { move } from '../../core-logic/fs/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import BadRequestError from '../../models/errors/bad-request-error.ts'
import { MoveRequestSchema, MoveResponseSchema } from '../../models/fs/move-request.ts'

const schema = {
  summary: 'Moves/renames an entry to another place',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  consumes: ['application/json'],
  produces: ['application/json'],
  body: MoveRequestSchema,
  response: {
    default: ApiErrorSchema,
    200: MoveResponseSchema,
  },
  tags: ['fs'],
}

const moveController: Controller<typeof schema> = async (req, reply) => {
  try {
    const { newPath, path } = req.body
    await move(req.appTenant!, path, newPath)
    reply.send({ done: true, path: newPath })
  } catch (e) {
    if (e instanceof AlreadyExistsException) {
      throw new BadRequestError('The newPath already exists, cannot move', 'newPath')
    }
    if (e instanceof NotExistsException) {
      throw new BadRequestError('The path should exist', 'path')
    }
    throw e
  }
}

moveController.options = {
  config: {
    authorization: {
      write: true,
    },
    jwt: {},
  },
  schema,
}

export default moveController
