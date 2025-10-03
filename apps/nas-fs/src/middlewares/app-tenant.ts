import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import getApp from '../core-logic/app.ts'
import type { App } from '../models/app.ts'
import NotFoundError from '../models/errors/not-found-error.ts'

declare module 'fastify' {
  interface FastifyRequest {
    appTenant: App | null
  }
}

const appTenantPlugin: FastifyPluginAsync = (fastify) => {
  fastify.decorateRequest('appTenant', null)
  fastify.addHook<{ Params: { appKey: string } }>('onRequest', (req) => {
    const { appKey } = req.params
    const app = getApp(appKey, req.log)
    if (!app) {
      throw new NotFoundError(`App '${appKey}' not found`)
    }

    req.appTenant = app
    return Promise.resolve()
  })

  return Promise.resolve()
}

export default fastifyPlugin(appTenantPlugin, { name: 'app-tenant' })
