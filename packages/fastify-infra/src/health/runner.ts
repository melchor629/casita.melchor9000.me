import type { HealthCheckEntry, HealthCheckResponse, HealthCheckResult, HealthCheckStatus } from './types.ts'

const n = Object.freeze({ degraded: 1, healthy: 0, unhealthy: 2 }) satisfies Record<HealthCheckStatus, number>
const worst = (a: HealthCheckStatus, b: HealthCheckStatus): HealthCheckStatus => (
  n[a] < n[b] ? b : a
)
const best = (a: HealthCheckStatus, b: HealthCheckStatus): HealthCheckStatus => (
  n[a] < n[b] ? a : b
)

export default async function healthCheckRunner(
  checks: ReadonlyArray<HealthCheckEntry>,
  signal: AbortSignal,
): Promise<HealthCheckResponse> {
  const startHealthCheckTime = Date.now()
  const healths = await Promise.all(
    checks.map(async (check) => {
      const start = Date.now()
      const result = await check.fn(check.params, signal)
        .catch((e): HealthCheckResult => ({
          status: 'unhealthy',
          reason: (e as Error).message,
          data: {},
        }))
      const duration = Date.now() - start
      return [{ ...result, duration, type: check.fn.type }, check] as const
    }),
  )
  const durationHealthCheck = Date.now() - startHealthCheckTime
  return Object.freeze({
    status: healths
      .map(([hc, c]) => best(hc.status, c.failureAs ?? 'unhealthy'))
      .reduce(worst, 'healthy'),
    duration: durationHealthCheck,
    checks: Object.fromEntries(healths.map(([hc, c]) => [c.key, hc])),
  })
}
