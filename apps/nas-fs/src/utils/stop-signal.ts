import logger from '../logger.ts'

type CloseableHandle = () => (void | Promise<unknown>)

const closeables: Map<string, CloseableHandle> = new Map()
const log = logger.child({ module: 'stop-signal' })

const onClose = () => {
  const names = Array.from(closeables.keys())
  if (names.length === 0) {
    return
  }

  log.info({ names }, `Calling close to ${closeables.size} closeables`)
  Promise.allSettled(names.map((name) => Promise.try(closeables.get(name)!)))
    .then((results): void => {
      results
        .map((result, i) => [result, names[i]] as const)
        .filter((p): p is [PromiseRejectedResult, string] => p[0].status === 'rejected')
        .forEach(([{ reason }, name]) => {
          log.error(reason, `Closeable ${name} failed`, { name })
        })

      results
        .map((result, i) => [result, names[i]] as const)
        .filter(([result]) => result.status === 'fulfilled')
        .forEach(([, name]) => {
          log.info(`Closeable ${name} called succesfully`)
          closeables.delete(name)
        })
    })
    .catch(() => {})
}

process.on('SIGINT', onClose)
process.on('SIGTERM', onClose)

export const addCloseableHandler = (name: string, fn: CloseableHandle) => {
  if (closeables.has(name)) {
    throw new Error(`There is already a closeable named ${name}`)
  }

  log.debug({ name, fn }, `Added new closeable ${name}`)
  closeables.set(name, fn)

  return () => {
    log.debug({ name, fn }, `Remove closeable ${name}`)
    closeables.delete(name)
  }
}

export const getCloseableHandlesCount = () => closeables.size
