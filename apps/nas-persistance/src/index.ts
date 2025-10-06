import 'reflect-metadata/lite'

import { type FastifyInstance, fastify } from 'fastify'
import { buildNasAuthServer } from './apollo-servers/index.js'
import { env, port } from './config.js'
import logger from './logger.js'
import nasAuthDataSource from './orm/nas-auth/connection.js'
import dataSourceHealthCheck from './utils/datasource-health-check.ts'

// https://blog.logrocket.com/how-build-graphql-api-typegraphql-typeorm/
// https://www.npmjs.com/package/apollo-server
// https://typegraphql.com/docs/getting-started.html

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
    nasAuthDataSource.initialize(),
    buildNasAuthServer(app as unknown as FastifyInstance),
  ])

  await app.register(import('@melchor629/fastify-infra/abort'))
  await app.register(import('@melchor629/fastify-infra/health'), {
    checks: (add) => {
      add('nas-auth', dataSourceHealthCheck, nasAuthDataSource)
    },
  })

  await app.listen({ host: '::', port })
  app.log.info('App ready')
} catch (e) {
  app.log.fatal(e)
  process.exit(1)
}
