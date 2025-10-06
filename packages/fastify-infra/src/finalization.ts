import fastifyPlugin from 'fastify-plugin'

type FinalizationPluginOptions = Readonly<{
  onPreFinalization?: () => Promise<void> | void
}>

const finalizationPlugin = fastifyPlugin((fastify, options: FinalizationPluginOptions) => {
  const finalizationFn = async () => {
    fastify.log.info('Closing server...')
    await options.onPreFinalization?.()
    await fastify.close()
  }

  fastify.addHook('onReady', () => {
    fastify.log.info('Service is ready!')
    if (typeof process.finalization === 'object') {
      process.finalization.register(fastify, () => {
        finalizationFn().catch(() => {})
      })
    } else {
      process.on('SIGTERM', () => {
        finalizationFn().catch(() => {})
      })
      process.on('SIGINT', () => {
        finalizationFn().catch(() => {})
      })
    }
    return Promise.resolve()
  })
  return Promise.resolve()
}, {
  name: '@melchor629/fastify-infra/finalization',
  fastify: '>=4',
})

export default finalizationPlugin
