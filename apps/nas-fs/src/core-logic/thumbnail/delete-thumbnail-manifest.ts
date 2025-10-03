import { join } from 'node:path'
import { remove } from 'fs-extra'
import type { App } from '../../models/app.ts'
import type { File } from '../../models/fs/file.ts'
import readThumbnailManifest from './read-thumbnail-manifest.ts'

const deleteThumbnailManifest = async (app: App, metadata: File) => {
  const { cache, logger: parentLogger } = app
  const logger = parentLogger.child({ module: 'core-logic.thumbnail.delete-thumbnail-manifest' })
  const key = `${metadata.path}:thumbnail`

  const manifest = await readThumbnailManifest(app, metadata)

  if (manifest) {
    logger.debug({ path: metadata.path }, `Deleting manifest for ${metadata.path}`)
    await Promise.all([
      remove(join(app.thumbnailPath, manifest.path)),
      cache.remove(key),
    ])
  }
}

export default deleteThumbnailManifest
