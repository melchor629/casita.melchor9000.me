import type { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify'
import type { NotFoundApiError } from '../models/errors/api-error.ts'

interface Route extends RouteGenericInterface {
  Reply: NotFoundApiError
}

const notFoundController = (req: FastifyRequest<Route>, reply: FastifyReply) => {
  const xForwardedPrefix = req.headers['x-forwarded-prefix'] || ''
  const urlPathPrefix = typeof xForwardedPrefix === 'string' ? xForwardedPrefix : xForwardedPrefix[0]
  reply.status(404).send({
    statusCode: 404,
    type: 'NotFound',
    message: `Cannot ${req.method} ${urlPathPrefix}${req.url}`,
    method: req.method,
    path: urlPathPrefix + req.url,
    requestId: req.id,
  })
}

export default notFoundController
