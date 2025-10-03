import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fresh from 'fresh'

interface CacheHeaderOptions {
  etag: string
  lastModified: Date
  cacheControl?: {
    maxAge?: number
  }
}

declare module 'fastify' {
  interface FastifyReply {
    setCacheHeaders(opts: CacheHeaderOptions): { fresh: boolean }
  }
}

const httpCachePlugin: FastifyPluginAsync = (fastify) => {
  fastify.decorateReply('setCacheHeaders', () => ({ fresh: false }))
  fastify.addHook<{ Params: { appId: string } }>('onRequest', async (req, reply) => {
    reply.setCacheHeaders = ({ cacheControl, etag, lastModified }) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        throw new Error('Cannot set cache on non-GET requests')
      }

      const lastModifiedString = lastModified.toUTCString()
      const isFresh = fresh(req.headers, {
        etag,
        lastModified: lastModifiedString,
      })
      reply.header('ETAG', etag)
      reply.header('Last-Modified', lastModifiedString)
      if (cacheControl) {
        const lines: string[] = []
        if (cacheControl.maxAge) {
          lines.push('max-age=10')
        }
        reply.header('Cache-Control', lines.join('; '))
      }
      return { fresh: isFresh }
    }
  })

  return Promise.resolve()
}

export default fastifyPlugin(httpCachePlugin, { name: 'http-cache' })
