import Redis from 'ioredis'
import { redisUrl } from '../config.ts'
import { addCloseableHandler } from '../utils/stop-signal.ts'
import type { Cache } from './cache.ts'
import RedisCache from './redis-cache.ts'

let redis: Redis.Redis | undefined
const cacheCache = new Map<string, Cache>()
const getCache = (appIdentifier: string): Cache => {
  if (!redisUrl) {
    throw new Error('Redis URL is not set')
  }

  if (redis === undefined) {
    redis = new (Redis as unknown as typeof Redis.default)(redisUrl, {
      showFriendlyErrorStack: process.env.NODE_ENV !== 'production',
      lazyConnect: true,
      offlineQueue: true,
      retryStrategy: (times) => Math.max(Math.min(Math.exp(times), 30_000), 1_000),
    })
    redis.on('error', () => {})
  }

  if (!cacheCache.has(appIdentifier)) {
    const cache = new RedisCache(redis, appIdentifier === 'π' ? undefined : `nas-fs:${appIdentifier}`)
    cacheCache.set(appIdentifier, cache)
  }

  return cacheCache.get(appIdentifier)!
}

export default getCache

addCloseableHandler('redis:cache', () => {
  if (redis) {
    if (redis.status === 'ready') {
      return redis.quit()
    }

    redis.disconnect(false)
  }

  return undefined
})
