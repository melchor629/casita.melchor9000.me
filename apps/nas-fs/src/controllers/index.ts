import type { FastifyInstance } from 'fastify'
import type { Redis } from 'ioredis'
import getCache from '../cache/provider.ts'
import { authApiBaseUrl } from '../config.ts'
import getPlexHealth from '../core-logic/health/plex.ts'
import homeController from './home.ts'
import notFoundController from './not-found.ts'

const appRoutesPlugin = async (fastify: FastifyInstance) => {
  await fastify.register(import('@melchor629/fastify-infra/http-cache'))
  await fastify.register(import('@melchor629/fastify-infra/jwt'), {
    oidcUrl: new URL(authApiBaseUrl),
    verify: {
      allowedAud: ['nas-fs'],
      requiredClaims: ['sub'],
    },
  })
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

  await fastify.register(import('@melchor629/fastify-infra/health'), {
    config: {
      jwt: { optional: true },
    },
    checks: async (add) => {
      const health = await import('@melchor629/fastify-infra/health')
      add('redis', health.ioredisHealthCheck, { client: () => (getCache('π') as unknown as { client: Redis }).client })
      add('nas-auth', health.externalHealthCheck, { url: new URL(authApiBaseUrl) }, 'degraded')
      add('plex', getPlexHealth, undefined, 'degraded')
    },
    shouldIncludeDetails: (req) => !!req.jwtToken?.payload.sub || process.env.NODE_ENV !== 'production',
  })
  fastify.get('/', homeController.options, homeController)

  fastify.setNotFoundHandler({
    preHandler: fastify.rateLimit({
      max: 10,
      timeWindow: '10s',
    }),
  }, notFoundController)
}

export default appRoutesPlugin
