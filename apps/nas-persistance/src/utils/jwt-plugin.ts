import fastifyJwt, { type TokenOrHeader } from '@fastify/jwt'
import type { FastifyPluginAsync, FastifyRequest } from 'fastify'
import buildGetJwks from 'get-jwks'
import { authorities } from '../config.js'

const getJwks = buildGetJwks({
  issuersWhitelist: authorities,
  ttl: 5 * 60 * 1000,
  providerDiscovery: true,
})

interface Options {
  optional?: boolean
  path: string
}

const verifyJwt: FastifyPluginAsync<Options> = async (fastify, { optional, path }) => {
  await fastify.register(fastifyJwt, {
    prefix: path,
    decode: {
      complete: true,
    },
    secret: (_: FastifyRequest, token: TokenOrHeader) => {
      if ('alg' in token) {
        const { alg, kid } = token
        return getJwks.getPublicKey({ kid, alg })
      }

      const { header: { alg, kid } } = token
      const payload = token.payload as unknown
      const domain = payload && typeof payload === 'object' && 'iss' in payload && typeof payload.iss === 'string'
        ? payload.iss
        : undefined
      return getJwks.getPublicKey({ kid, domain, alg })
    },
    verify: {
      cache: true,
    },
  })

  fastify.addHook('onRequest', async (request, reply) => {
    const { authorization } = request.raw.headers
    if (optional && (!authorization || !authorization.startsWith('Bearer '))) {
      return
    }

    try {
      await request.jwtVerify()
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

// @ts-expect-error types does not include this propery
verifyJwt[Symbol.for('skip-override')] = true

export default verifyJwt
