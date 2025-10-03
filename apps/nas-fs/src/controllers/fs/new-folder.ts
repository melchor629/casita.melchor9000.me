import { AlreadyExistsException, NotExistsException } from '../../core-logic/exceptions/index.ts'
import { newFolder } from '../../core-logic/fs/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import BadRequestError from '../../models/errors/bad-request-error.ts'
import { NewFolderRequestSchema, NewFolderResponseSchema } from '../../models/fs/new-folder-request.ts'

const schema = {
  summary: 'Creates a new folder',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  consumes: ['application/json'],
  produces: ['application/json'],
  body: NewFolderRequestSchema,
  response: {
    default: ApiErrorSchema,
    200: NewFolderResponseSchema,
  },
  tags: ['fs'],
}

const newFolderController: Controller<typeof schema> = async (req, reply) => {
  try {
    const { folderName, path } = req.body
    const finalPath = await newFolder(req.appTenant!, path, folderName)
    reply.send({ done: true, path: finalPath })
  } catch (e) {
    if (e instanceof NotExistsException) {
      throw new BadRequestError('The path must exist', 'path')
    } else if (e instanceof AlreadyExistsException) {
      throw new BadRequestError('Cannot create folder, another item exists with the same name', 'folderName')
    } else {
      throw e
    }
  }
}

newFolderController.options = {
  config: {
    authorization: {
      write: true,
    },
    jwt: {},
  },
  schema,
}

export default newFolderController
