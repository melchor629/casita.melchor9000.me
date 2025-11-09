import { trace, type Span } from '@opentelemetry/api'
import packageJson from '../../package.json' with { type: 'json' }

export const tracer = trace.getTracer('@melchor629/nice-ssr', packageJson.version)

export function startSpan<T>(name: string, fn: (span: Span) => T): T {
  return tracer.startActiveSpan(name, (span) => {
    const result = fn(span)
    if (result instanceof Promise) {
      void result.finally(() => span.end())
    } else {
      span.end()
    }
    return result
  })
}
