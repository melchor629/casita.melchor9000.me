import type { Redis } from 'ioredis'
import getCache from '../../cache/provider.ts'
import type { CacheHealthCheck } from '../../models/health/index.ts'

const getRedisHealth = async (): Promise<CacheHealthCheck> => {
  const redis = (getCache('π') as unknown as { client: Redis }).client
  if (!redis) {
    return {
      type: 'redis',
      status: 'healthy',
      reason: 'Redis is not configured',
      duration: 0,
    }
  }

  if (
    redis.status === 'connecting'
      || redis.status === 'connect'
      || redis.status === 'ready'
  ) {
    const startPingTime = Date.now()
    const [, keys] = await Promise.all([
      redis.ping('ping'),
      redis.dbsize(),
    ])
    const duration = Date.now() - startPingTime
    return {
      status: duration < 500 ? 'healthy' : 'degraded',
      type: 'redis',
      duration,
      keys,
    }
  }

  const startPingTime = Date.now()
  const error = await redis.ping('ping').catch((e) => e as Error)
  return {
    status: 'unhealthy',
    reason: `Cannot connect to redis: ${error}`,
    type: 'redis',
    duration: Date.now() - startPingTime,
  }
}

export default getRedisHealth
