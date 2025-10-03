import fs from 'node:fs'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import fastify from 'fastify'
import { nanoid } from 'nanoid'
import * as config from './config.ts'
import logger from './logger.ts'
import { addCloseableHandler } from './utils/stop-signal.ts'

declare module 'fastify' {
  interface FastifyInstance {
    packageJson: typeof import('../package.json')
    globalDisposables: Array<() => Promise<void> | void>
  }
}

const start = async () => {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8')) as typeof import('../package.json')

  logger.info({ version: packageJson.version }, `Starting nas-fs app v${packageJson.version}...`)

  const app = fastify({
    loggerInstance: logger,
    trustProxy: true,
    bodyLimit: 10_000_000,
    genReqId: () => nanoid(31),
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.decorate('packageJson', packageJson)
  app.decorate('globalDisposables', [])

  app.setErrorHandler(async (error, req, reply) => {
    let type = ('type' in error && error.type as string) || error.code || error.name || error.constructor.name || null
    if (type === 'Error') {
      type = null
    }

    if (!error.statusCode || typeof error.statusCode !== 'number') {
      req.log.error(error, 'Unhandled error thrown during request')
      reply.status(500).send({
        statusCode: 500,
        type,
        message: error.message,
        requestId: req.id,
      })
    } else {
      req.log.debug(error, 'Handled error thrown during request')
      reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        type,
        message: error.message,
        requestId: req.id,
      })
    }
  })

  await app.register(import('@autotelic/fastify-opentelemetry').then((t) => t.default), {
    wrapRoutes: true,
  })

  await app.register(import('./middlewares/trace.ts'))

  if (config.pathPrefix) {
    await app.register(import('./controllers/index.ts'), {
      prefix: config.pathPrefix,
    })
  } else {
    await app.register(import('./controllers/index.ts'))
  }

  await app.listen({
    host: '::',
    port: config.port,
  })

  addCloseableHandler('fastify', async () => {
    logger.info('Stopping nas-fs...')
    await Promise.all(app.globalDisposables.map((fn) => Promise.try(fn)))
    await app.close()
    logger.info('Stopped nas-fs')
  })
}

export default start
