import type { FastifyOtelInstrumentation } from '@fastify/otel'
import type { Span, SpanOptions } from '@opentelemetry/api'
import type { FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    trace: <T>(
      this: FastifyRequest,
      key: string,
      options: SpanOptions,
      fn: (span: Span) => Promise<T> | T,
    ) => Promise<T> | T
  }
}

type TelemetryPluginOptions = Readonly<{
  instrumentation: FastifyOtelInstrumentation
}>

const telemetryPlugin = fastifyPlugin(async (fastify, { instrumentation }: TelemetryPluginOptions) => {
  await fastify.register(instrumentation.plugin())

  fastify.decorateRequest('trace', function trace<T>(
    this: FastifyRequest,
    key: string,
    options: SpanOptions,
    fn: (span: Span) => Promise<T> | T,
  ) {
    const otel = this.opentelemetry()
    const runner = async (span: Span) => {
      try {
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
      }
    }

    return otel.tracer.startActiveSpan(key, options, runner)
  })
}, {
  name: '@melchor629/fastify-infra/telemetry',
  fastify: '>=4',
})

export default telemetryPlugin
