import fastifyPlugin from 'fastify-plugin'

type FinalizationPluginOptions = Readonly<{
  onPreFinalization?: () => Promise<void> | void
}>

const finalizationPlugin = fastifyPlugin((fastify, options: FinalizationPluginOptions) => {
  const finalizationFn = async () => {
    try {
      fastify.log.info('Closing service 🫱🫲')
      await options.onPreFinalization?.()
      await fastify.close()
      fastify.log.info('Service closed 🤝')
    } catch (e) {
      fastify.log.error(e, 'Failed closing service 🖕🫲')
    }
  }

  fastify.addHook('onReady', () => {
    fastify.log.info('Service is ready!')
    process.on('SIGTERM', () => {
      finalizationFn().catch(() => {})
    })
    process.on('SIGINT', () => {
      finalizationFn().catch(() => {})
    })
    return Promise.resolve()
  })
  return Promise.resolve()
}, {
  name: '@melchor629/fastify-infra/finalization',
  fastify: '>=4',
})

export default finalizationPlugin
