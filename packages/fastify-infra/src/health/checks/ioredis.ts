import type { Redis } from 'ioredis'
import type { HealthCheck } from '../types.ts'

type RedisHealthCheckOptions = {
  client: Redis | (() => Redis)
}

const ioredisHealthCheck: HealthCheck<RedisHealthCheckOptions> = async ({ client }) => {
  const redis = typeof client === 'function' ? client() : client
  if (
    redis.status === 'connecting'
      || redis.status === 'connect'
      || redis.status === 'ready'
  ) {
    const [, keys, info] = await Promise.all([
      redis.ping('ping'),
      redis.dbsize(),
      redis.info('server'),
    ])
    return {
      status: 'healthy',
      data: {
        keys,
        info: Object.fromEntries(
          info
            .split('\n')
            .slice(1)
            .map((split) => split.replace('\r', '').split(':'))
            .filter(([key]) => key.startsWith('redis_') || key.startsWith('valkey_') || key === 'os' || key.startsWith('uptime_')),
        ),
      },
    }
  }

  const error = await redis.ping('ping').catch((e) => e as Error)
  return {
    status: 'unhealthy',
    reason: `Cannot connect to redis: ${error}`,
    data: {},
  }
}

ioredisHealthCheck.type = 'ioredis'

export default ioredisHealthCheck
