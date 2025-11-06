import type { FastifyContextConfig, FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import healthCheckRunner from './runner.ts'
import type { HealthCheck, HealthCheckEntry, HealthCheckResponse, HealthCheckStatus } from './types.ts'

type HealthCheckPluginOptions = Readonly<{
  shouldIncludeDetails?: (request: FastifyRequest) => Promise<boolean> | boolean
  path?: `/${string}`
  checks: (add: <T>(key: string, fn: HealthCheck<T>, params: T, maxWorst?: HealthCheckStatus) => void) => Promise<void> | void
  config?: FastifyContextConfig
}>

const responseSchema = {
  type: 'object',
  title: 'HealthCheckResponse',
  required: ['status', 'duration', 'checks'],
  properties: {
    status: {
      type: 'string',
      enum: ['healthy', 'degraded', 'unhealthy'],
    },
    duration: {
      type: 'number',
      min: 0,
    },
    checks: {
      type: 'object',
      additionalProperties: {
        title: 'HealthCheckResult',
        type: 'object',
        required: ['type', 'status', 'data', 'duration'],
        properties: {
          type: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['healthy', 'degraded', 'unhealthy'],
          },
          reason: {
            type: ['string', 'null'],
          },
          data: {
            type: 'object',
            additionalProperties: true,
          },
          duration: {
            type: 'number',
            min: 0,
          },
        },
      },
    },
  },
}

const healthCheckPlugin = fastifyPlugin(async (fastify, options: HealthCheckPluginOptions): Promise<void> => {
  const checks: HealthCheckEntry[] = []
  await options.checks((key, fn, params, maxWords) => {
    checks.push({
      key,
      params,
      fn: fn as HealthCheck<unknown>,
      failureAs: maxWords,
    })
  })

  fastify.get<{ Body: never, Reply: HealthCheckResponse }>(
    options.path ?? '/health',
    {
      logLevel: 'fatal',
      schema: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore from swagger
        summary: 'Health Check',
        produces: ['application/json'],
        tags: ['health'],
        response: {
          200: responseSchema,
          503: responseSchema,
        },
      },
      config: { otel: false, ...options.config },
    },
    async (req, reply) => {
      const shouldIncludeDetails = await options.shouldIncludeDetails?.(req) ?? true
      const response = await healthCheckRunner(checks, req.cancelSignal)
      if (shouldIncludeDetails) {
        await reply.send(response)
      } else {
        await reply.send({ ...response, checks: {} })
      }
    },
  )
}, {
  name: '@melchor629/fastify-infra/health',
  fastify: '>=4',
  decorators: {
    request: ['cancelSignal'],
  },
  dependencies: ['@melchor629/fastify-infra/abort'],
})

export default healthCheckPlugin
