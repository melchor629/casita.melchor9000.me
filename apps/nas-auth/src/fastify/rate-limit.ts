import type { FastifyRateLimitOptions, FastifyRateLimitStore } from '@fastify/rate-limit'
import { fastifyPlugin } from 'fastify-plugin'
import { redisPrefix } from '../config.ts'
import client from '../redis.ts'

declare module '@fastify/rate-limit' {
  interface FastifyRateLimitOptions {
    timeWindow: number
    max: number
    continueExceeding?: boolean
    exponentialBackoff?: boolean
  }
}

class RedisStore implements FastifyRateLimitStore {
  #route: string = 'global'
  #options: FastifyRateLimitOptions

  constructor(options: FastifyRateLimitOptions) {
    this.#options = options
  }

  child(routeOptions: object): FastifyRateLimitStore {
    let id = 'global'
    if ('groupId' in routeOptions && typeof routeOptions.groupId === 'string') {
      id = routeOptions.groupId
    }
    return new RedisStore(this.#options).#setRoute(id)
  }

  incr(key: string, callback: (error: Error | null, result?: { current: number; ttl: number; }) => void): void {
    const redisKey = `${redisPrefix}:rate-limit:${this.#route}:[${key}]`
    client.rateLimit(
      redisKey,
      this.#options.timeWindow,
      this.#options.max,
      this.#options.continueExceeding ?? false,
      this.#options.exponentialBackoff ?? false,
    )
      .then((result) => callback(null, { current: result[0], ttl: result[1] }))
      .catch(callback)
  }

  #setRoute(route: string) {
    this.#route = route
    return this
  }
}

const RateLimitPlugin = fastifyPlugin(async (app) => {
  await app.register(import('@fastify/rate-limit'), {
    global: true,
    max: 100,
    timeWindow: '15s',
    ban: 100,
    store: RedisStore,
  })
})

export default RateLimitPlugin
