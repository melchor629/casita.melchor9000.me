import type { Span, SpanOptions } from '@opentelemetry/api'
import type { FastifyRequest } from 'fastify'
import plugin from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    trace: (<T>(key: string, options: SpanOptions, fn: (span: Span) => Promise<T> | T) => Promise<T>) & { notRoot: boolean }
  }
}

/**
 * Registers trace function within Fastify.
 * @param app Fastify application
 */
const tracePlugin = plugin(function tracePlugin(app) {
  app.decorateRequest('trace', function trace<T>(
    this: FastifyRequest,
    key: string,
    options: SpanOptions,
    fn: (span: Span) => Promise<T> | T,
  ) {
    const otel = this.openTelemetry()
    const runner = async (span: Span) => {
      let undo = false
      try {
        if (!this.trace.notRoot) {
          undo = true
          this.trace.notRoot = true
        }
        const returnValue = fn(span)
        if (returnValue instanceof Promise) {
          return await returnValue
        }

        return returnValue
      } catch (e) {
        span.setStatus({ code: 2, message: (e as Error).message })
        throw e
      } finally {
        span.end()
        if (undo) {
          this.trace.notRoot = false
        }
      }
    }

    return this.trace.notRoot
      ? otel.tracer.startActiveSpan(key, options, runner)
      : otel.tracer.startActiveSpan(key, options, otel.context, runner)
  })

  return Promise.resolve()
})

export default tracePlugin
