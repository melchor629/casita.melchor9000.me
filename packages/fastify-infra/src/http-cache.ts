import fastifyPlugin from 'fastify-plugin'
import fresh from 'fresh'

interface CacheHeaderOptions {
  etag: string
  lastModified: Date
  cacheControl?: {
    maxAge?: number
  }
}

interface CacheHeadersResult {
  fresh: boolean
}

declare module 'fastify' {
  interface FastifyReply {
    /**
     * Sets the headers from the provided values and returns if the request
     * indicates the requester has fresh data.
     * @param opts Values for the cache headers.
     */
    setCacheHeaders(opts: CacheHeaderOptions): CacheHeadersResult
  }
}

const httpCachePlugin = fastifyPlugin((fastify) => {
  fastify.decorateReply('setCacheHeaders', () => ({ fresh: false }))
  fastify.addHook('onRequest', async (req, reply) => {
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
}, {
  name: '@melchor629/fastify-infra/http-cache',
  fastify: '>=4',
})

export default httpCachePlugin
