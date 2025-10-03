import getAuthServerHealth from '../core-logic/health/auth-server.ts'
import getPlexHealth from '../core-logic/health/plex.ts'
import getRedisHealth from '../core-logic/health/redis.ts'
import type { Controller } from '../models/controller.ts'
import { ApiErrorSchema } from '../models/errors/api-error.ts'
import { HealthCheckResponseSchema, type HealthCheckResponse } from '../models/health/health-check-response.ts'
import type { HealthCheck } from '../models/health/index.ts'

const schema = {
  summary: 'Health Check',
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: HealthCheckResponseSchema,
    503: HealthCheckResponseSchema,
  },
}

const n: Record<HealthCheck['status'], number> = { degraded: 1, healthy: 0, unhealthy: 2 }
const worst = (a: HealthCheck['status'], b: HealthCheck['status']): HealthCheck['status'] => (
  n[a] < n[b] ? b : a
)

const healthController: Controller<typeof schema> = async (req, reply) => {
  const startHealthCheckTime = Date.now()
  const healths = await Promise.all([
    getRedisHealth(),
    getAuthServerHealth(),
    getPlexHealth(),
  ])
  const durationHealthCheck = Date.now() - startHealthCheckTime
  const [
    cache,
    authApi,
    plex,
  ] = healths

  const health: HealthCheckResponse = {
    status: healths.map((hc) => hc.status).reduce(worst, 'healthy'),
    duration: durationHealthCheck,
    services: req.jwtToken?.payload.sub
      ? {
          cache,
          authApi,
          plex,
        }
      : undefined,
  }

  reply
    .status(health.status === 'unhealthy' ? 503 : 200)
    .send(health)
}

healthController.options = {
  config: {
    jwt: { optional: true },
  },
  schema,
  logLevel: 'warn',
}

export default healthController
