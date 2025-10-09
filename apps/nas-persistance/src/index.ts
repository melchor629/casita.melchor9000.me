import { type FastifyInstance, fastify } from 'fastify'
import { buildNasAuthServer } from './apollo-servers/index.ts'
import { env, port } from './config.ts'
import logger from './logger.ts'
import nasAuthClient from './orm/nas-auth/connection.ts'
import dataSourceHealthCheck from './utils/datasource-health-check.ts'

const app = fastify({
  loggerInstance: logger,
  forceCloseConnections: true,
})

try {
  app.log.info('Starting...')

  if (env === 'dev') {
    // eslint-disable-next-line import-x/no-extraneous-dependencies
    await app.register(import('@fastify/cors'), {
      origin: [`http://localhost:${port}`, 'https://studio.apollographql.com'],
    })
  }

  await app.register(import('@autotelic/fastify-opentelemetry'), {
    wrapRoutes: true,
  })

  await Promise.all([
    nasAuthClient.$connect(),
    buildNasAuthServer(app as unknown as FastifyInstance),
  ])

  await app.register(import('@melchor629/fastify-infra/abort'))
  await app.register(import('@melchor629/fastify-infra/health'), {
    checks: (add) => {
      add('nas-auth', dataSourceHealthCheck, nasAuthClient)
    },
  })

  await app.listen({ host: '::', port })
  app.log.info('App ready')
} catch (e) {
  app.log.fatal(e)
  process.exit(1)
}
