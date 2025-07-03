import path from 'node:path'
import type {} from '@fastify/middie'
import { fastifyPlugin } from 'fastify-plugin'
import type * as EntryServer from '../entry/server.ts'
import { renderRoute, runMiddleware } from './render.ts'

declare module 'fastify' {
  interface FastifyReply {
    renderPage(page: `/${string}` | 'not-found'): Promise<void>
    renderErrorPage(error: Error): Promise<void>
  }
}

export type SsrPluginOptions = {
  prefix: string
  prod: boolean
}

type GetSsrServerFn = () => Promise<{
  server: typeof EntryServer
  processError?: (error: Error) => void
}>

type SsrRouterPluginOptions = SsrPluginOptions & {
  getSsrServer: GetSsrServerFn
}

const ssrRouterPlugin = fastifyPlugin(async (app, { getSsrServer, prefix, prod }: SsrRouterPluginOptions) => {
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

    const { server } = await getSsrServer()
    for (const route of server.getAll()) {
      const fastifyPath = route.routePathname.replaceAll(/\[(\w+)\]/g, ':$1')
      app.log.info({ type: route.type, path: fastifyPath }, 'Registering route')
      if (route.type === 'route') {
        app.all(fastifyPath, async (req, reply) => {
          await renderRoute(req, reply, route, server)
        })
      } else {
        app.get(fastifyPath, async (req, reply) => {
          await renderRoute(req, reply, route, server)
        })
        if (fastifyPath !== '/') {
          app.get(fastifyPath + '/', async (req, reply) => {
            await renderRoute(req, reply, route, server)
          })
        }
      }
    }

    app.log.info('Registering not found handler')
    app.setNotFoundHandler(async (_, res) => {
      await res.renderPage('not-found')
    })
  } else {
    app.log.info('Registering dev route handler')
    app.setNotFoundHandler(async (req, res) => {
      const pathname = req.url.split('?')[0].replace(/\/$/, '') as `/${string}`
      await res.renderPage(pathname)
    })
  }

  app.log.info('Registering middleware handler')
  app.addHook('onRequest', async function ssrMiddlewareHook(req, reply) {
    const { processError, server } = await getSsrServer()
    await runMiddleware(
      req,
      reply,
      prefix,
      server,
      processError,
    )
  })
}, {
  name: '@melchor629/nice-ssr/router',
  encapsulate: true,
  fastify: '^5.0.0',
})

const ssrPlugin = fastifyPlugin(async (app, options: SsrPluginOptions) => {
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

  app.decorateReply('renderPage', async function renderPage(pathname) {
    const { processError, server } = await getSsrServer()
    this.log.debug({ pathname }, 'Looking for route to render')
    const route = server.get(pathname)
    await renderRoute(this.request, this, route, server, processError)
  })

  app.decorateReply('renderErrorPage', async function renderErrorPage(error) {
    const { processError, server } = await getSsrServer()
    this.log.debug({ pathname: 'error' }, 'Looking for route to render')
    const route = server.get('error')
    await renderRoute(this.request, this, route, server, processError, error)
  })

  await app.register(ssrRouterPlugin, {
    ...options,
    getSsrServer,
  })
}, {
  name: '@melchor629/nice-ssr/render',
  fastify: '^5.0.0',
})

export default ssrPlugin
