import type { App } from '../../models/app.ts'
import type { File } from '../../models/fs/file.ts'
import type { ThumbnailManifest } from '../../models/thumbnails/thumbnail-manifest.ts'

const readThumbnailManifest = async (
  app: App,
  metadata: File,
): Promise<ThumbnailManifest | null> => {
  const { cache, logger: parentLogger, thumbnailPath } = app
  const logger = parentLogger.child({ module: 'core-logic.thumbnail.read-thumbnail-manifest' })

  if (metadata.realPath.startsWith(thumbnailPath)) {
    logger.warn({ path: metadata.path }, 'Trying to read thumbnail manifest from a thumbnail!')
    throw new Error('Target cannot be from thumbnails folder')
  }

  try {
    logger.debug({ path: metadata.path }, `Reading thumbnail manifest for ${metadata.path}`)
    const key = `${metadata.path}:thumbnail`
    const manifest = await cache.get<ThumbnailManifest>(key)
    return manifest
  } catch {
    return null
  }
}

export default readThumbnailManifest
