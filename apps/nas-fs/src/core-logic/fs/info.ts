import type { BigIntStats } from 'node:fs'
import fs from 'node:fs/promises'
import Path from 'node:path'
import etag from 'etag'
import type { App } from '../../models/app.ts'
import type { DirectoryEntry } from '../../models/fs/directory-entry.ts'
import { fromStat } from '../../parsers/directory-entry.ts'
import { normalize } from './fs-watcher.ts'
import { ensureExists } from './utils.ts'

const currentEntryVersion = 2

export type CacheDirectoryEntry = DirectoryEntry & {
  cacheMetadata?: {
    lastModified: string
    etag: string
    version?: number
  }
}

const generateCacheMetadata = ({ stat }: CacheDirectoryEntry) => {
  const modificationTime = BigInt(stat.modificationTime.ms)
  const changeTime = BigInt(stat.changeTime.ms)
  const lastModified = (modificationTime < changeTime ? changeTime : modificationTime).toString()
  const lastModifiedDate = new Date(Number(BigInt(lastModified)))
  const tag = etag({
    ctime: lastModifiedDate,
    mtime: lastModifiedDate,
    ino: 0,
    size: stat.size,
  }, { weak: true })

  return {
    lastModified,
    etag: tag,
    version: currentEntryVersion,
  }
}

const info = async (
  {
    cache,
    logger: parentLogger,
    notifier,
    storagePath,
    thumbnailPath,
    uploadPath,
  }: App,
  _path: string,
): Promise<CacheDirectoryEntry> => {
  const logger = parentLogger.child({ module: 'core-logic.fs.info' })
  const path = normalize(_path)
  const fullPath = Path.join(storagePath, path)
  const cacheKey = `${path}:info`
  let model: CacheDirectoryEntry | null = null
  let dirStat: BigIntStats | undefined

  try {
    await ensureExists(fullPath)

    logger.debug({ path, fullPath }, `Trying to get info for path ${path}`)
    model = await cache.get(cacheKey)
    if (model !== null) {
      dirStat = await fs.lstat(fullPath, { bigint: true })
      const mtimeIsDifferent = BigInt(model.stat.modificationTime.ms) !== BigInt(dirStat.mtimeMs)
      const ctimeIsDifferent = BigInt(model.stat.changeTime.ms) !== BigInt(dirStat.ctimeMs)
      const versionIsDifferent = model.cacheMetadata?.version !== currentEntryVersion
      if (mtimeIsDifferent || ctimeIsDifferent || versionIsDifferent) {
        const what = [
          mtimeIsDifferent && 'modification time',
          ctimeIsDifferent && 'change time',
          versionIsDifferent && 'version',
        ]
          .filter((f) => f)
          .join(', ')
        logger.debug(
          { path, fullPath },
          `Detected change from the ${what}, removing entry from cache`,
        )
        if (!versionIsDifferent) {
          await notifier.change(path)
        }
        model = null
      }
    }

    if (model === null) {
      logger.debug({ path, fullPath }, `Getting ${path} info from the system`)
      dirStat = dirStat || await fs.lstat(fullPath, { bigint: true })
      const tmpModel = await fromStat(path, dirStat, storagePath, { detailed: true })
      model = {
        ...tmpModel,
        cacheMetadata: generateCacheMetadata(tmpModel),
      }

      if (!fullPath.startsWith(thumbnailPath) && !fullPath.startsWith(uploadPath)) {
        await cache.set(cacheKey, model)
      }
    }

    return model
  } catch (e) {
    await cache.remove(...(await cache.getKeys(`${path}:*`)))
    throw e
  }
}

export default info
