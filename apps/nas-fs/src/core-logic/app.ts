import type { Redis } from 'ioredis'
import getCache from '../cache/provider.ts'
import { apps } from '../config.ts'
import logger from '../logger.ts'
import type { App } from '../models/app.ts'
import { getNotifier } from './fs/fs-watcher.ts'

const getApp = (appIdentifier: string, loggerImpl?: App['logger'], redisInstance?: Redis): App | undefined => {
  if (appIdentifier in apps) {
    let notifier: ReturnType<typeof getNotifier> | null = null
    return Object.freeze({
      ...apps[appIdentifier],
      get cache() { return getCache(appIdentifier, redisInstance) },
      get notifier() {
        notifier ??= getNotifier(getCache(appIdentifier))
        return notifier
      },
      logger: (loggerImpl || logger).child({ app: appIdentifier }),
      mediaLibrary: Object.freeze({
        jellyfin: apps[appIdentifier].jellyfinLibraryId,
        plex: apps[appIdentifier].plexLibraryId,
      }),
    })
  }

  return undefined
}

export default getApp
