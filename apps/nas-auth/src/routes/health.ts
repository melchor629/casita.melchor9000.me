import { nasPersistenceUrl } from '../config.ts'
import { getRedisHealth } from '../redis.ts'
import type { Controller, GenericRoute } from './models.ts'

interface Route extends GenericRoute {
  Querystring: { detailed?: string }
  Reply: unknown
}

const n = { degraded: 1, healthy: 0, unhealthy: 2 }
const worst = (a: keyof typeof n, b: keyof typeof n) => (n[a] < n[b] ? b : a)

const sendApiHealth = async (url: URL) => {
  const startTime = Date.now()
  const res = await fetch(`${url.toString().replace(/\/$/, '')}/health`, {})
  const duration = Date.now() - startTime
  if (!res.headers.get('content-type')?.startsWith('application/json')) {
    return {
      status: 'unhealthy' as const,
      reason: 'Auth API returned invalid status',
      statusCode: res.status,
      body: await res.text(),
      duration,
    }
  }

  const data = await res.json() as {
    status: keyof typeof n
    statusCode: number
  }
  return {
    status: data.status,
    statusCode: res.status,
    services: { api: data },
    duration,
  }
}

const getHealthController: Controller<Route> = async (req, res) => {
  const [redis, nasPersistence] = await Promise.all([
    getRedisHealth(),
    sendApiHealth(nasPersistenceUrl),
  ])

  const status = worst(redis.status as keyof typeof n, nasPersistence.status)
  await res.status(status === 'unhealthy' ? 503 : 200).send({
    status,
    services: req.query.detailed && {
      redis,
      nasPersistence,
    },
  })
}

getHealthController.options = {}

export default getHealthController
