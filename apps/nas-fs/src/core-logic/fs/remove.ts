import fs from 'node:fs/promises'
import Path from 'node:path'

import type { App } from '../../models/app.ts'
import { normalize } from './fs-watcher.ts'
import { ensureExists } from './utils.ts'

const removeDirRecursive = async (directoryPath: string) => {
  const items = await Promise.all(
    (await fs.readdir(directoryPath))
      .map((item) => Path.join(directoryPath, item))
      .map((item) => Promise.all([
        Promise.resolve(item),
        fs.stat(item),
      ])),
  )
  const files = items.filter(([, stats]) => !stats.isDirectory())
  const directories = items.filter(([, stats]) => stats.isDirectory())

  await Promise.all(directories.map(([path]) => removeDirRecursive(path)))
  await Promise.all(files.map(([path]) => fs.unlink(path)))
  await fs.rmdir(directoryPath)
}

const remove = async (
  { logger: parentLogger, notifier, storagePath }: App,
  path: string,
  recursive: boolean = true,
) => {
  const logger = parentLogger.child({ module: 'core-logic.fs.remove' })
  const fullPath = Path.join(storagePath, normalize(path))

  await ensureExists(fullPath)

  logger.debug({ path: fullPath }, `Trying to rename ${fullPath}`)
  const stat = await fs.stat(fullPath)
  if (stat.isFile()) {
    await fs.unlink(fullPath)
    await notifier.unlinkFile(normalize(path))
  } else {
    if (recursive) {
      await removeDirRecursive(fullPath)
    } else {
      await fs.rmdir(fullPath)
    }

    await notifier.unlinkDir(normalize(path))
  }
}

export default remove
