import path from 'node:path'
import fastify from 'fastify'
import { nanoid } from 'nanoid'
import {
  base,
  enableExtraSecurity,
  isProduction,
  logLevel,
  port,
  staticDirPath,
} from './config.ts'

// Create http server
const app = fastify({
  logger: {
    level: logLevel,
    transport: !isProduction
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss.l Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },

  genReqId: () => nanoid(23),
  requestTimeout: 120,
  trustProxy: true,
})

if (isProduction) {
  await app.register(import('@fastify/compress'))
} else {
  // eslint-disable-next-line import-x/no-extraneous-dependencies
  await app.register(import('@fastify/middie'))
}

// Add some nice security headers to the page
await app.register(import('@fastify/helmet'), {
  hsts: false,
  contentSecurityPolicy: {
    reportOnly: !enableExtraSecurity,
    directives: {
      'img-src': ['\'self\'', 'data:', '*.melchor9000.me'],
      'media-src': ['\'self\'', 'blob:'],
      'style-src': ['\'self\'', 'unsafe-inline'],
      'script-src': ['\'self\'', (req) => {
        req.headers['x-script-nonce'] = nanoid()
        return `'nonce-${req.headers['x-script-nonce']}'`
      }],
    },
  },
})

// Add Vite or respective production middlewares
await app.register(import('@melchor629/nice-ssr/fastify'), {
  prefix: base,
  prod: isProduction,
})

// Serve static resources from here
await app.register(import('@fastify/static'), {
  root: path.resolve(staticDirPath),
  prefix: base,
  allowedPath: (pathName) => !pathName.endsWith('/') && !pathName.endsWith('/index.html'),
  constraints: {
    host: /^localhost|casita\.melchor9000\.me$/,
  },
  decorateReply: false,
})

// health check
const ok = Buffer.from([0x4F, 0x4B, 0x0A])
app.get<{ Reply: Buffer }>(
  '/h',
  { logLevel: 'silent', compress: false, helmet: false },
  async (_, reply) => reply.header('content-type', 'text/plain; charset=utf-8').send(ok),
)

// Start http server
await app.listen({
  port,
  host: isProduction ? '::' : 'localhost',
})
app.log.info('Server started!')

process.finalization.register(app, (app) => {
  app.log.info('Closing server...')
  app.close().catch(() => {})
})
