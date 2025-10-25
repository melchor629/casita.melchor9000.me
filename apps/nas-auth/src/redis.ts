import { createClient } from 'redis'
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
})

client.connect().catch(() => {})
client.on('error', () => {});

['SIGINT', 'SIGTERM'].map((signal) => process.once(signal, () => void client.quit()))

export default client
