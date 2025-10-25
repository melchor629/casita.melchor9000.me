import { isDebug, port } from './config.ts'
import createApp from './fastify/app.ts'

try {
  const app = await createApp()

  await app.listen({
    port,
    host: isDebug ? 'localhost' : '::',
  });

  ['SIGINT', 'SIGTERM'].map((signal) => process.once(signal, () => {
    app.log.warn('Closing...')
    app.close().catch(() => {})
  }))
} catch (error) {
  console.error(error)
  process.exit(1)
}
