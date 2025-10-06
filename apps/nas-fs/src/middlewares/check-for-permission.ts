import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import type { Cache } from '../cache/cache.ts'
import { authApiBaseUrl, authApplicationKey } from '../config.ts'
import ForbiddenError from '../models/errors/forbidden-error.ts'
import UnauthorizedError from '../models/errors/unauthorized-error.ts'

interface TokenInfoPermission {
  name: string
  applicationKey: string
  write: boolean
  delete: boolean
}

interface TokenInfoResult {
  permissions: TokenInfoPermission[]
}

declare module 'fastify' {
  interface FastifyContextConfig {
    authorization?: {
      optional?: true
      write?: boolean
      delete?: boolean
      admin?: boolean
    },
  }

  interface FastifyRequest {
    authorization?: {
      admin: boolean
      delete: boolean
      write: boolean
      permissions: TokenInfoPermission[]
    }
  }
}

const fetchPermissions = async (token: string, user: string, cache: Cache) => {
  const maybeToken = await cache.get<TokenInfoResult>(`auth-cache:${user}`)
  if (maybeToken !== null) {
    return maybeToken
  }

  const res = await fetch(`${authApiBaseUrl}/token/permissions`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.headers.get('Content-Type')?.includes('application/json')) {
    throw new Error(`Invalid response from auth server: ${res.status}`)
  }

  const data = (await res.json()) as TokenInfoResult
  if (!res.ok) {
    throw new Error(JSON.stringify(data))
  }

  await cache.set<TokenInfoResult>(`auth-cache:${user}`, data, 5 * 60 * 1000)
  return data
}

const authorizationPlugin: FastifyPluginAsync = (fastify) => {
  fastify.decorateRequest('authorization')
  fastify.addHook('preValidation', async (req) => {
    await req.trace(
      'permissions check',
      {},
      async () => {
        if (!req.routeOptions.config.authorization) {
          return
        }

        if (req.routeOptions.config.authorization.optional && !req.jwtToken) {
          return
        }
        if (!req.jwtToken || !req.appTenant) {
          throw new UnauthorizedError()
        }
        if (!req.jwtToken.payload.sub) {
          throw new ForbiddenError('Token does not contain sub claim')
        }

        const { permissions } = await fetchPermissions(
          req.jwtToken.token,
          req.jwtToken.payload.sub,
          req.appTenant.cache,
        )
        const appPermissions = (permissions || [])
          .filter((p) => p.applicationKey === authApplicationKey)
        const perm = appPermissions.find((p) => p.name === req.appTenant!.identifier)
        const adminPerm = appPermissions.find((p) => p.name === `${req.appTenant!.identifier}:admin`)
        if (permissions && perm) {
          req.authorization = {
            admin: (adminPerm?.delete && adminPerm?.write) ?? false,
            delete: perm.delete,
            write: perm.write,
            permissions,
          }
        } else {
          req.appTenant.logger.warn(`The user ${req.jwtToken.payload.sub} is not allowed to access this app`)
          throw new ForbiddenError('The user is not allowed to access any resource')
        }
      },
    )
  })
  fastify.addHook('preValidation', (req) => {
    if (!req.routeOptions.config.authorization) {
      return Promise.resolve()
    }

    const { sub } = req.jwtToken!.payload
    const { authorization: args } = req.routeOptions.config
    const permission = req.authorization!
    if (args.write && !permission.write) {
      req.appTenant?.logger.warn({ user: sub }, `The user ${sub} is not allowed to write`)
      throw new ForbiddenError('The user is not allowed to access this resource')
    } else if (args.delete && !permission.delete) {
      req.appTenant?.logger.warn({ user: sub }, `The user ${sub} is not allowed to delete`)
      throw new ForbiddenError('The user is not allowed to access this resource')
    } else if (args.admin && !permission.admin) {
      req.appTenant?.logger.warn({ user: sub }, `The user ${sub} is not allowed to do admin stuff`)
      throw new ForbiddenError('The user is not allowed to access this resource')
    }

    return Promise.resolve()
  })

  return Promise.resolve()
}

export default fastifyPlugin(authorizationPlugin, { name: 'authorization' })
