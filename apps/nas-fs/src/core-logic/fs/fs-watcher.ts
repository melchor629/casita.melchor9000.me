import { dirname, normalize as pathNormalize, sep } from 'node:path'
import type { Cache } from '../../cache/cache.ts'

type FSEventType = 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir' | 'thumbnail'

const publishEvent = (cache: Cache, path: string, type: FSEventType) => (
  cache.publish('fs-events', {
    path,
    type,
  })
)

export const getNotifier = (cache: Cache) => {
  const notifier = {
    addFile: (realPath: string) => Promise.all([
      publishEvent(cache, realPath, 'add'),
      publishEvent(cache, dirname(realPath), 'change'),
    ]),

    change: async (realPath: string) => Promise.all([
      cache.remove(
        ...await cache.getKeys(`${realPath}:*`),
        ...await (realPath !== '/' ? cache.getKeys(`${dirname(realPath)}:*`) : []),
      ),
      publishEvent(cache, realPath, 'change'),
      realPath !== '/' && publishEvent(cache, dirname(realPath), 'change'),
    ]),

    unlinkFile: async (realPath: string) => Promise.all([
      cache.remove(
        ...await cache.getKeys(`${realPath}:*`),
        ...await cache.getKeys(`${dirname(realPath)}:*`),
      ),
      publishEvent(cache, realPath, 'unlink'),
      publishEvent(cache, dirname(realPath), 'change'),
    ]),

    moveFile: (oldRealPath: string, newRealPath: string) => Promise.all([
      notifier.unlinkFile(oldRealPath),
      notifier.addFile(newRealPath),
    ]),

    moveDir: (oldRealPath: string, newRealPath: string) => Promise.all([
      notifier.unlinkDir(oldRealPath),
      notifier.addDir(newRealPath),
    ]),

    addDir: (realPath: string) => Promise.all([
      publishEvent(cache, realPath, 'addDir'),
      publishEvent(cache, dirname(realPath), 'change'),
    ]),

    unlinkDir: async (realPath: string) => Promise.all([
      cache.remove(
        ...await cache.getKeys(`${realPath}*:*`),
        ...await cache.getKeys(`${dirname(realPath)}:*`),
      ),
      publishEvent(cache, realPath, 'unlinkDir'),
      publishEvent(cache, dirname(realPath), 'change'),
    ]),

    thumbnail: (realPath: string) => publishEvent(cache, realPath, 'thumbnail'),
  }
  return notifier
}

export const normalize = (path: string | [string, unknown]): string => {
  // Paths will never end with a trailing / (\ on Windows)
  let realPath = Array.isArray(path) ? path[0] : path
  if (realPath !== '/' && realPath.endsWith(sep)) {
    realPath = realPath.substring(0, realPath.length - 1)
  }
  return pathNormalize(realPath)
}
