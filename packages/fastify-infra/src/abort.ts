import type { FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    /**
     * When this signal is aborted, the request has been detected as cancelled or
     * aborted. Use with caution because some requests may be marked as cancelled
     * wrongly.
     */
    cancelSignal: AbortSignal
  }
}

const abortPlugin = fastifyPlugin((fastify) => {
  fastify.decorateRequest('cancelSignal')

  const signals = new WeakMap<FastifyRequest, AbortController>()
  fastify.addHook('onRequest', (request) => {
    const ctrl = new AbortController()
    request.cancelSignal = ctrl.signal
    signals.set(request, ctrl)

    ctrl.signal.addEventListener('abort', () => signals.delete(request), { once: true })
    request.raw.once('close', () => {
      if (!ctrl.signal.aborted) ctrl.abort()
    })
    request.raw.once('error', () => {
      if (!ctrl.signal.aborted) ctrl.abort()
    })
    return Promise.resolve()
  })
  fastify.addHook('onResponse', (request) => {
    signals.delete(request)
    return Promise.resolve()
  })
}, {
  name: '@melchor629/fastify-infra/abort',
  fastify: '>=4',
})

export default abortPlugin
