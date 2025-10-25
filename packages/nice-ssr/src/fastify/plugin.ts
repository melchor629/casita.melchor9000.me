import path from 'node:path'
import type {} from '@fastify/middie'
import type { FastifyInstance, FastifyReply } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import type * as EntryServer from '../entry/server.ts'
import { createRequest, writeResponse } from './mappers.ts'

type RenderRouterOptions = Readonly<{
  hijack?: boolean
  error?: Error | 'not-found'
  props?: Record<string, unknown>
}>

declare module 'fastify' {
  interface FastifyReply {
    renderRoute(route?: `/${string}`, options?: RenderRouterOptions): Promise<void>
    renderRouteToResponse(page?: `/${string}`, options?: RenderRouterOptions): Promise<Response>
  }
}

export type SsrPluginOptions = {
  prefix: `/${string}`
  prod: boolean
}

type GetSsrServerFn = () => Promise<{
  server: typeof EntryServer
  processError?: (error: Error) => void
}>

type SsrRouterPluginOptions = SsrPluginOptions

const ssrRouterPlugin = fastifyPlugin(async (app, { prod }: SsrRouterPluginOptions) => {
  // remove all body parsers from fastify, leave nice-ssr do the job
  app.removeAllContentTypeParsers()
  app.addContentTypeParser('*', (_1, _2, done) => done(null))

  if (prod) {
    await app.register(import('@fastify/static'), {
      root: path.resolve('./dist/client/.p'),
      prefix: '/.p',
      index: false,
      allowedPath: (pathName) => !pathName.endsWith('/') && !pathName.endsWith('/index.html'),
      decorateReply: false,
    })
  }

  app.log.info('Registering route handler')
  app.setNotFoundHandler(async (_, res) => {
    await res.renderRoute()
  })
}, {
  name: '@melchor629/nice-ssr/router',
  encapsulate: true,
  fastify: '^5.0.0',
})

const ssrPlugin: (app: FastifyInstance, options: SsrPluginOptions) => Promise<void> = fastifyPlugin(async (app: FastifyInstance, options: SsrPluginOptions): Promise<void> => {
  let getSsrServer: GetSsrServerFn

  if (options.prod) {
    const server = await import(path.join(process.cwd(), 'dist', 'server', 'server.js')) as typeof EntryServer
    getSsrServer = () => Promise.resolve({ server })
  } else {
    if (app.use == null) {
      throw new Error('Please add @fastify/middie or @fastify/express for development')
    }

    const { createServer, isRunnableDevEnvironment } = await import('vite')
    app.log.info('Creating vite server')
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base: options.prefix,
    })

    app.log.info('Registering vite handler')
    app.use(vite.middlewares)

    const { ssr } = vite.environments
    if (!isRunnableDevEnvironment(ssr)) {
      throw new Error('Missing vite plugin, please import and use "@melchor629/nice-ssr/vite" plugin')
    }

    getSsrServer = async () => {
      const server = await ssr.runner.import<typeof EntryServer>('@melchor629/nice-ssr/server')
      return {
        server,
        processError: vite.ssrFixStacktrace.bind(vite),
      }
    }

    app.addHook('onClose', () => vite.close())
  }

  async function render(
    reply: FastifyReply,
    pathname?: `/${string}`,
    props?: Record<string, unknown>,
    error?: Error | 'not-found',
  ) {
    const { processError, server } = await getSsrServer()
    reply.log.debug({ pathname }, 'Looking for route to render')
    const request = createRequest(reply.request, reply, pathname)
    const response = await server.renderRoute(request, {
      log: reply.log,
      signal: null!,
      basePathname: options.prefix,
      processError,
      error,
      props,
    })
    return response
  }

  app.decorateReply('renderRoute', async function renderPage(pathname, { error, hijack, props } = {}) {
    const response = await render(this, pathname, props, error)
    await writeResponse(response, this, hijack)
  })

  app.decorateReply('renderRouteToResponse', async function renderPageToResponse(pathname, { error, props } = {}) {
    const response = await render(this, pathname, props, error)
    return response
  })

  await app.register(ssrRouterPlugin, options)
}, {
  name: '@melchor629/nice-ssr/render',
  fastify: '^5.0.0',
})

export default ssrPlugin
