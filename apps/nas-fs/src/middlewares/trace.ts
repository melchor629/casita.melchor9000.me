import type { Span, SpanOptions } from '@opentelemetry/api'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    trace: (<T>(
      this: FastifyRequest,
      key: string,
      options: SpanOptions,
      fn: (span: Span) => Promise<T> | T,
    ) => Promise<T> | T) & {
      notRoot: boolean
    }
  }
}

function tracePlugin(app: FastifyInstance) {
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
}

export default fastifyPlugin(tracePlugin, { name: 'trace' })
