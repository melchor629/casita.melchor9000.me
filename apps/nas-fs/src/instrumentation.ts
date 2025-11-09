import { FastifyOtelInstrumentation } from '@fastify/otel'
import createTelemetry from '@melchor629/infra/telemetry'
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis'
import packageJson from '../package.json' with { type: 'json' }
import { otlp } from './config.ts'

export const fastifyInstrumentation = new FastifyOtelInstrumentation()

const telemetry = createTelemetry({
  disabled: !otlp.enabled,
  service: {
    name: 'nas-fs',
    version: packageJson.version,
  },
  endpoint: {
    url: otlp.url!,
  },
  instrumentations: [
    fastifyInstrumentation,
    new IORedisInstrumentation({
      requireParentSpan: true,
    }),
  ],
})

process.on('SIGTERM', () => void telemetry?.[Symbol.asyncDispose]())
process.on('SIGINT', () => void telemetry?.[Symbol.asyncDispose]())

export default telemetry
