import type { Controller } from '../models/controller.ts'
import { ApiErrorSchema } from '../models/errors/api-error.ts'
import { HomeResponseSchema } from '../models/home.ts'

const schema = {
  summary: 'Says hello!',
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: HomeResponseSchema,
  },
}

const homeController: Controller<typeof schema> = async (req, reply) => {
  reply.status(200).send({
    version: req.server.packageJson.version,
  })
}

homeController.options = {
  config: {
    jwt: { optional: true },
  },
  schema,
  logLevel: 'warn',
}

export default homeController
