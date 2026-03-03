import { createClient, defineScript, type CommandParser } from 'redis'
import { redisUrl } from './config.ts'

const client = createClient({
  url: redisUrl,
  name: 'nas-auth',
  // keyPrefix: redisPrefix,
  disableOfflineQueue: false,
  RESP: 2,
  socket: {
    reconnectStrategy: (times) => Math.max(Math.min(Math.exp(times), 20_000), 1_000),
  },
  scripts: {
    // based on https://github.com/fastify/fastify-rate-limit/blob/main/store/RedisStore.js
    rateLimit: defineScript({
      SCRIPT: `
        -- Key to operate on
        local key = KEYS[1]
        -- Time window for the TTL
        local timeWindow = tonumber(ARGV[1])
        -- Max requests
        local max = tonumber(ARGV[2])
        -- Flag to determine if TTL should be reset after exceeding
        local continueExceeding = ARGV[3] == 'true'
        --Flag to determine if exponential backoff should be applied
        local exponentialBackoff = ARGV[4] == 'true'

        --Max safe integer
        local MAX_SAFE_INTEGER = (2^53) - 1

        -- Increment the key's value
        local current = redis.call('INCR', key)

        if current == 1 or (continueExceeding and current > max) then
          redis.call('PEXPIRE', key, timeWindow)
        elseif exponentialBackoff and current > max then
          local backoffExponent = current - max - 1
          timeWindow = math.min(timeWindow * (2 ^ backoffExponent), MAX_SAFE_INTEGER)
          redis.call('PEXPIRE', key, timeWindow)
        else
          timeWindow = redis.call('PTTL', key)
        end

        return {current, timeWindow}
      `,
      NUMBER_OF_KEYS: 1,
      parseCommand(parser: CommandParser, key: string, timeWindow: number, max: number, continueExceeding: boolean, exponentialBackoff: boolean) {
        parser.pushKey(key)
        parser.push(timeWindow.toString(), max.toString(), continueExceeding.toString(), exponentialBackoff.toString())
      },
      transformReply: (reply: number[]) => [reply[0], reply[1]] as const,
    }),
  },
})

client.connect().catch(() => {})
client.on('error', () => {});

['SIGINT', 'SIGTERM'].map((signal) => process.once(signal, () => void client.quit()))

export default client
