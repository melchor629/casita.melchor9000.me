import fs from 'node:fs/promises'
import Path from 'node:path'

import type { App } from '../../models/app.ts'
import { normalize } from './fs-watcher.ts'
import { ensureExists, ensureNotExists } from './utils.ts'

export default async (
  { logger: parentLogger, notifier, storagePath }: App,
  path: string,
  folderName: string,
) => {
  const logger = parentLogger.child({ module: 'core-logic.fs.new-folder' })
  const fullPath = Path.join(storagePath, normalize(path))
  const fullNewFolderPath = Path.join(fullPath, folderName)

  await ensureExists(fullPath)
  await ensureNotExists(fullNewFolderPath)

  logger.debug(
    { path: fullPath, newFolderPath: fullNewFolderPath },
    `Trying to create folder '${folderName}' at ${fullPath}`,
  )
  await fs.mkdir(fullNewFolderPath, { recursive: true, mode: 0o775 })

  const finalPath = Path.join(normalize(path), folderName)
  await notifier.addDir(finalPath)
  return finalPath
}
