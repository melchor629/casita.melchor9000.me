import type { FastifyInstance } from 'fastify'
import healthController from './health.ts'
import homeController from './home.ts'
import notFoundController from './not-found.ts'

const appRoutesPlugin = async (fastify: FastifyInstance) => {
  await fastify.register(import('../middlewares/http-cache.ts'))
  await fastify.register(import('../middlewares/rate-limiter.ts'))
  await fastify.register(import('../middlewares/ensure-jwt.ts'))
  await fastify.register(import('../middlewares/swagger.ts'))
  await fastify.register(import('../middlewares/route-processor.ts'))

  await fastify.register(async (app) => {
    await app.register(import('../middlewares/app-tenant.ts'))
    await app.register(import('../middlewares/check-for-permission.ts'))

    await app.register(import('./fs/index.ts'))
    await app.register(import('./upload/index.ts'), { prefix: '/upload' })
    await app.register(import('./jobs/index.ts'), { prefix: '/jobs' })
    await app.register(import('./media/index.ts'), { prefix: '/media' })
  }, {
    prefix: '/:appKey',
  })

  fastify.get('/health', healthController.options, healthController)
  fastify.get('/', homeController.options, homeController)

  fastify.setNotFoundHandler({
    preHandler: fastify.rateLimit({
      max: 10,
      timeWindow: '10s',
    }),
  }, notFoundController)
}

export default appRoutesPlugin
