import type { VerifyOptions } from '@fastify/jwt'
import type { FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import buildGetJwks from 'get-jwks'

declare module 'fastify' {
  interface FastifyContextConfig {
    /**
     * Marks this route as protected by jwt. By default the protection requires a valid
     * JWT token in the header.
     */
    jwt?: {
      /**
       * Allow passing a JWT token through the query params.
       */
      allowQuery?: boolean
      /**
       * Marks the token as optional. If a token is provided, validations will still apply.
       */
      optional?: boolean
    }
  }

  interface FastifyRequest {
    /**
     * The decoded JWT token.
     */
    jwtToken?: Readonly<{
      header: { alg: string, kid?: string } & Record<string, string>
      payload: {
        aud?: string
        sub?: string
        iss?: string
      } & Record<string, string | undefined>
      signature: Record<string, string>
      token: string
    }>
  }
}

type JwtPluginOptions = Readonly<{
  oidcUrl: URL | URL[]
  verify?: Partial<VerifyOptions>
}>

const jwtPlugin = fastifyPlugin(async (fastify, { oidcUrl, verify }: JwtPluginOptions) => {
  const issuers = Array.isArray(oidcUrl) ? oidcUrl.map((url) => url.origin) : [oidcUrl.origin]
  const getJwks = buildGetJwks({
    issuersWhitelist: issuers,
    providerDiscovery: true,
    max: 100,
    ttl: 5 * 60 * 1000,
  })

  const getSecret = (_: unknown, asdf: NonNullable<FastifyRequest['jwtToken']>) => {
    const { header: { alg, kid }, payload } = asdf
    return getJwks.getPublicKey({ kid, domain: payload.iss ?? issuers[0], alg })
  }

  await fastify.register(import('@fastify/jwt'), {
    decode: {
      complete: true,
    },
    secret: getSecret as never,
    verify: {
      ...verify,
      cache: true,
      complete: true,
      allowedIss: issuers,
    },
  })

  fastify.decorateRequest('jwtToken')
  fastify.addHook('preValidation', async (req, reply) => {
    if (
      req.routeOptions.config.jwt?.allowQuery
        && req.query
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
      req.jwtToken = Object.freeze({
        ...(await req.jwtVerify()),
        token: req.server.jwt.lookupToken(req),
      } satisfies NonNullable<FastifyRequest['jwtToken']>)
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && typeof err.code === 'string') {
        if (err.code === 'FAST_JWT_MALFORMED') {
          reply.code(401)
        }
      }

      reply.send(err)
    }
  })
}, {
  name: '@melchor629/fastify-infra/jwt',
  fastify: '>=4',
})

export default jwtPlugin
