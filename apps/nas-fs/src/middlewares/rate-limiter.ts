import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import Redis from 'ioredis'
import { rateLimiter as rateLimiterConf, redisUrl } from '../config.ts'

const rateLimiterPlugin: FastifyPluginAsync = async (fastify) => {
  if (redisUrl) {
    const client = new (Redis as unknown as typeof Redis.default)(
      redisUrl,
      {
        connectionName: 'nas-fs:rate-limit',
        enableOfflineQueue: false,
        connectTimeout: 1000,
        maxRetriesPerRequest: 1,
      },
    )
    client.on('error', () => {})
    await fastify.register(import('@fastify/rate-limit'), {
      global: true,
      max: rateLimiterConf.requestsPerSecond,
      timeWindow: '1s',
      allowList: ['127.0.0.1'],
      redis: client,
      nameSpace: 'nas-fs:rate-limit:',
    })
    fastify.addHook('onClose', () => (client.status === 'ready' ? client.quit() : client.disconnect(false)))
  }
}

export default fastifyPlugin(rateLimiterPlugin, { name: 'rate-limiter' })
