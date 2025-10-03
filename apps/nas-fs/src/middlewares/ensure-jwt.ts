import type { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import buildGetJwks from 'get-jwks'
import { authApiBaseUrl } from '../config.ts'

declare module 'fastify' {
  interface FastifyContextConfig {
    jwt?: {
      optional?: boolean
    },
  }

  interface FastifyRequest {
    jwtToken?: {
      header: { alg: string, kid?: string } & Record<string, string>
      payload: {
        aud: string
        sub: string
        iss?: string
      }
      signature: Record<string, string>
      token: string
    }
  }
}

const getJwks = buildGetJwks({
  issuersWhitelist: [new URL(authApiBaseUrl).origin],
  providerDiscovery: true,
  max: 100,
  ttl: 5 * 60 * 1000,
})

const getSecret = (
  request: FastifyRequest,
  { header: { alg, kid }, payload: { iss } }: NonNullable<FastifyRequest['jwtToken']>,
) => (
  request.trace(
    'jwt getPublicKey',
    {},
    () => getJwks.getPublicKey({ kid, domain: iss, alg }),
  )
)

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import('@fastify/jwt'), {
    decode: {
      complete: true,
    },
    secret: getSecret as never,
    verify: {
      // TODO forever ?
      cache: true,
      allowedIss: [new URL(authApiBaseUrl).origin],
      allowedAud: ['nas-fs'],
      requiredClaims: ['sub'],
      complete: true,
    },
  })

  fastify.decorateRequest('jwtToken')
  fastify.addHook('preValidation', async (req, reply) => {
    if (
      req.query
        && typeof req.query === 'object'
        && 'token' in req.query
        && typeof req.query.token === 'string'
        && req.query.token
        && !req.headers.authorization
    ) {
      // DO NOT DO THIS AT HOME
      req.headers.authorization = `Bearer ${req.query.token}`
    }

    const { authorization } = req.headers
    const optional = !req.routeOptions.config.jwt || req.routeOptions.config.jwt.optional
    if (optional && (!authorization || !authorization.startsWith('Bearer '))) {
      return
    }

    try {
      req.jwtToken = await req.trace(
        'jwt verify',
        {},
        async () => ({
          ...(await req.jwtVerify()),
          token: req.server.jwt.lookupToken(req),
        } satisfies NonNullable<FastifyRequest['jwtToken']>),
      )
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && typeof err.code === 'string') {
        if (err.code === 'FAST_JWT_MALFORMED') {
          reply.code(401)
        }
      }

      reply.send(err)
    }
  })
}

export default fastifyPlugin(jwtPlugin, { name: 'jwt' })
