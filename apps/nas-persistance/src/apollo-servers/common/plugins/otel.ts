import type { ApolloServerPlugin } from '@apollo/server'
import type { OpenTelemetryReqInstance } from '@autotelic/fastify-opentelemetry'
import { trace } from '@opentelemetry/api'

type BaseContext = {
  openTelemetry: () => OpenTelemetryReqInstance
}

type Options = {
  name: string
}

export default function otelPlugin<TContext extends BaseContext>(
  { name }: Options,
): ApolloServerPlugin<TContext> {
  return {
    requestDidStart({ contextValue: { openTelemetry } }) {
      const otel = openTelemetry()
      const span = otel.tracer.startSpan(`${name} graphql request`, {}, otel.context)
      const parentContext = trace.setSpan(otel.context, span)
      return Promise.resolve({
        parsingDidStart() {
          const subSpan = otel.tracer.startSpan(`${name} graphql request parsing`, {}, parentContext)
          return Promise.resolve((e) => {
            subSpan.setStatus({ code: e ? 2 : 1, message: e?.message })
            subSpan.end()
            return Promise.resolve()
          })
        },
        validationDidStart() {
          const subSpan = otel.tracer.startSpan(`${name} graphql request validation`, {}, parentContext)
          return Promise.resolve((e) => {
            subSpan.setStatus({ code: (e?.length ?? 0) > 0 ? 2 : 1 })
            subSpan.end()
            return Promise.resolve()
          })
        },
        executionDidStart() {
          const subSpan = otel.tracer.startSpan(`${name} graphql request execution`, {}, parentContext)
          return Promise.resolve({
            executionDidEnd() {
              subSpan.end()
              return Promise.resolve()
            },
          })
        },
        willSendResponse({ errors }) {
          span.setStatus({ code: (errors?.length ?? 0) > 0 ? 2 : 1 })
          span.end()
          return Promise.resolve()
        },
      })
    },
  }
}
