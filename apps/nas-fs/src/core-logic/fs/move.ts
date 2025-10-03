import fs from 'node:fs/promises'
import Path from 'node:path'

import type { App } from '../../models/app.ts'
import { normalize } from './fs-watcher.ts'
import { ensureExists, ensureNotExists } from './utils.ts'

const move = async (
  { logger: parentLogger, notifier, storagePath }: App,
  path: string,
  newPath: string,
) => {
  const logger = parentLogger.child({ module: 'core-logic.fs.move' })
  const fullPath = Path.join(storagePath, normalize(path))
  const fullNewPath = Path.join(storagePath, normalize(newPath))

  await ensureExists(fullPath)
  await ensureNotExists(fullNewPath)

  logger.debug({ path: fullPath, newPath: fullNewPath }, `Moving ${fullPath} to ${newPath}`)
  const stat = await fs.stat(fullPath)
  await fs.rename(fullPath, fullNewPath)
  if (stat.isFile()) {
    await notifier.moveFile(normalize(path), normalize(newPath))
  } else {
    await notifier.moveDir(normalize(path), normalize(newPath))
  }
}

export default move
