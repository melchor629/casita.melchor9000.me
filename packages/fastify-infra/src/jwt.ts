import type { FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { JOSEError } from 'jose/errors'
import { createRemoteJWKSet } from 'jose/jwks/remote'
import { jwtVerify } from 'jose/jwt/verify'

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
      header: { alg: string, kid?: string } & Record<string, unknown>
      payload: {
        aud: string
        sub: string
        iss: string
      } & Record<string, unknown>
      token: string
    }>
  }
}

type JwtPluginOptions = Readonly<{
  oidcUrl: URL
  verify?: Readonly<Partial<{
    audience?: string | string[]
    clockTolerance?: string | number
    requiredClaims?: string[]
  }>>
}>

const createRemoteJWKSetFromOidc = async (url: URL) => {
  const response = await fetch(new URL('./.well-known/openid-configuration', url), {
    redirect: 'follow',
  })
  if (!response.ok) {
    throw new Error('Could not contact OIDC (status ' + response.status + ')')
  }
  const { jwks_uri: jwksUri } = await response.json() as { jwks_uri?: string }
  if (!jwksUri) {
    throw new Error('Could not read OIDC configuration')
  }

  return createRemoteJWKSet(new URL(jwksUri), {
    timeoutDuration: 5000,
    cacheMaxAge: 6 * 3600,
  })
}

const jwtPlugin = fastifyPlugin((fastify, { oidcUrl, verify }: JwtPluginOptions) => {
  let jwks: Awaited<ReturnType<typeof createRemoteJWKSetFromOidc>> | null = null

  fastify.decorateRequest('jwtToken')
  fastify.addHook('preValidation', async (req, reply) => {
    let token: string | null = null
    if (
      req.routeOptions.config.jwt?.allowQuery
        && req.query
        && typeof req.query === 'object'
        && 'token' in req.query
        && typeof req.query.token === 'string'
        && req.query.token
        && !req.headers.authorization
    ) {
      token = req.query.token
    }

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.slice(7)
    }

    const optional = !req.routeOptions.config.jwt || req.routeOptions.config.jwt.optional
    if (optional && !token) {
      return
    } else if (!token) {
      return reply.code(401)
    }

    try {
      jwks ??= await createRemoteJWKSetFromOidc(oidcUrl)
      const result = await jwtVerify(token, jwks, {
        issuer: oidcUrl.origin,
        audience: verify?.audience,
        clockTolerance: verify?.clockTolerance,
        requiredClaims: verify?.requiredClaims ?? ['sub', 'iss', 'aud'],
      })
      req.jwtToken = Object.freeze({
        header: result.protectedHeader,
        payload: {
          ...result.payload,
          aud: result.payload.aud as string,
          iss: result.payload.iss!,
          sub: result.payload.sub!,
        },
        token,
      } satisfies NonNullable<FastifyRequest['jwtToken']>)
    } catch (err) {
      if (err && err instanceof JOSEError) {
        req.log.warn({ err }, 'Invalid token received')
        return reply.code(401)
      }

      reply.send(err)
    }
  })

  return Promise.resolve()
}, {
  name: '@melchor629/fastify-infra/jwt',
  fastify: '>=4',
})

export default jwtPlugin
