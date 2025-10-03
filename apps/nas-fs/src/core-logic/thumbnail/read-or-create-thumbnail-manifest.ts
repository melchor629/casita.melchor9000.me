import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import Path from 'node:path'
import type { App } from '../../models/app.ts'
import type { File } from '../../models/fs/file.ts'
import type { ThumbnailManifest } from '../../models/thumbnails/thumbnail-manifest.ts'
import getImages from './get-images.ts'
import readThumbnailManifest from './read-thumbnail-manifest.ts'

const getThumbnailHashForMetadata = (metadata: File) => {
  const hasher = createHash('sha512')
  hasher.update(metadata.path, 'binary')
  return hasher.digest('hex')
}

const createThumbnailManifest = async (
  {
    cache, logger, notifier, storagePath, thumbnailPath,
  }: App,
  metadata: File,
): Promise<ThumbnailManifest> => {
  const key = `${metadata.path}:thumbnail`
  const fullPathHash = getThumbnailHashForMetadata(metadata)
  const thumbnailFolderPath = Path.join(thumbnailPath, fullPathHash)

  logger.debug({ path: metadata.path }, 'Generating thumbnails')
  const images = await getImages(metadata)
  if (images.length === 0) {
    logger.trace({ path: metadata.path }, `File ${metadata.path} has no images`)
    const manifest = {
      path: fullPathHash,
      modificationTime: new Date(0).toISOString(),
      images: [],
    }
    await cache.set(key, manifest)
    return manifest
  }

  await fs.mkdir(Path.join(thumbnailFolderPath, 'original'), { recursive: true })
  await Promise.all(images.map(async (image, j) => {
    const source = Path.join(storagePath, metadata.path)
    const target = Path.join(thumbnailFolderPath, 'original', j.toString())
    if (image.originalSoftLink) {
      await fs.unlink(target).catch(() => {})
      return fs.symlink(source, target)
    }
    return fs.writeFile(target, image.data)
  }))

  logger.trace({ path: metadata.path }, `File ${metadata.path} has ${images.length} images`)
  const manifest = {
    path: fullPathHash,
    modificationTime: new Date().toISOString(),
    images: images.map((image) => ({ ...image, data: undefined, originalSoftLink: undefined })),
  }
  await Promise.all([
    cache.set(key, manifest),
    notifier.thumbnail(metadata.path),
  ])
  return manifest
}

const readOrCreateThumbnailManifest = async (app: App, metadata: File) => {
  const { logger: parentLogger } = app
  const logger = parentLogger.child({ module: 'core-logic.thumbnail.read-or-create-thumbnail-manifest' })

  try {
    let manifest = await readThumbnailManifest(app, metadata)
    if (manifest == null) {
      manifest = await createThumbnailManifest({ ...app, logger }, metadata)
    }

    return manifest
  } catch (e) {
    logger.debug({ err: e, path: metadata.path }, 'Manifest cannot be read or created')
    throw e
  }
}

export default readOrCreateThumbnailManifest
