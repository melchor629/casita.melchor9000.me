import type { RouteHandlerMethod } from 'fastify'
import type { DataSource } from 'typeorm'
import nasAuthDataSource from '../orm/nas-auth/connection.js'

type HealthResult = Readonly<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  reason?: string
  duration: number
}>

const n = { degraded: 1, healthy: 0, unhealthy: 2 } as const
const worst = (a: keyof typeof n, b: keyof typeof n) => (n[a] < n[b] ? b : a)

const check = async <T extends string>(key: T, ds: DataSource): Promise<readonly [T, HealthResult]> => {
  const now = Date.now()
  try {
    await ds.showMigrations()
    return [key, {
      status: 'healthy',
      duration: Date.now() - now,
    }] as const
  } catch (e) {
    return [key, {
      status: 'degraded',
      reason: (e as Error).message,
      duration: Date.now() - now,
    }] as const
  }
}

const healthController: RouteHandlerMethod = async (_, reply) => {
  const checks = await Promise.all([
    check('nas-auth', nasAuthDataSource),
  ])

  const status = checks
    .map(([, c]) => c.status)
    .reduce((a, c) => worst(a, c), 'healthy' as keyof typeof n)
  reply.status(status === 'unhealthy' ? 503 : 200).send({
    status,
    services: Object.fromEntries(checks),
  })
}

export default healthController
