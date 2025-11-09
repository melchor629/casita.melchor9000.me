import createLogger from '@melchor629/infra/logger'
import { RedisStore } from 'connect-redis'
import Fastify from 'fastify'
import { nanoid } from 'nanoid'
import {
  cookieKeysDefault,
  isDebug,
  logLevel,
  nasPersistanceUrl,
  publicUrl,
  redisPrefix,
  sessionSignKey,
} from '../config.ts'
import { fastifyInstrumentation } from '../instrumentation.ts'
import client from '../redis.ts'
import registerRoutes from '../routes/register.ts'

// NOTE remove grant confirmation, auto-grant

declare module 'fastify' {
  interface Session {
    login?: Readonly<{ provider: string, interactionId: string }>
    loginResult?: Readonly<{ provider: string, token: import('@fastify/oauth2').Token, profile: object }>
  }
}

const createApp = async () => {
  const app = Fastify({
    loggerInstance: createLogger('nas-fs', logLevel),
    pluginTimeout: 1 * 60 * 1000, // next can take a lot of time...
    trustProxy: true,
    genReqId: () => nanoid(31),
  })

  // telemetry
  await app.register(import('@melchor629/fastify-infra/telemetry'), {
    instrumentation: fastifyInstrumentation,
  })

  // form body parser
  await app.register(import('@fastify/formbody'))

  // disable cache in /i routes
  await app.register(import('@fastify/caching'), {
    prefix: '/i',
    privacy: 'no-cache',
  })

  // cookie parsing
  await app.register(import('@fastify/cookie'), {
    secret: cookieKeysDefault,
    parseOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: publicUrl.startsWith('https:'),
    },
  })

  // session in cookies, stored in redis
  await app.register(import('@fastify/session'), {
    secret: sessionSignKey,
    cookieName: 'auth_session',
    cookie: { maxAge: 864e3 },
    idGenerator: () => nanoid(),
    store: new RedisStore({
      client,
      prefix: `${redisPrefix}:session:`,
      ttl: 864e3,
    }),
  })

  // @fastify/oauth2 for external auth
  await app.register(import('./oauth2.ts'))

  await app.register(import('@melchor629/fastify-infra/abort'))
  await app.register(import('@melchor629/fastify-infra/health'), {
    checks: async (add) => {
      const health = await import('@melchor629/fastify-infra/health')
      add('redis', health.redisHealthCheck, { client: () => client })
      add('nas-persistance', health.externalHealthCheck, { url: new URL(nasPersistanceUrl) }, 'degraded')
    },
    shouldIncludeDetails: () => true,
  })

  // register API methods
  registerRoutes(app as never)

  // register node-oidc
  app.register(async function oidcPlugin(fastify) {
    const { default: oidc } = await import('../oidc/oidc.ts')
    const oidcCallback = oidc.callback()
    fastify.removeAllContentTypeParsers()
    fastify.addContentTypeParser('*', (_1, _2, done) => done(null))
    fastify.all('/*', async (req, reply) => {
      reply.hijack()
      Object.assign(reply.raw, { reply })
      Object.assign(req.raw, {
        originalUrl: req.raw.url,
        url: req.raw.url?.slice(5),
      })
      await oidcCallback(req.raw, reply.raw)
    })
  }, {
    prefix: '/oidc',
  })

  // nice-ssr plugin
  await app.register(import('@fastify/middie'))
  await app.register(import('@melchor629/nice-ssr/fastify'), {
    prefix: '/',
    prod: !isDebug,
  })

  return app
}

export default createApp
