import fs from 'node:fs/promises'
import Path from 'node:path'
import type { App } from '../../models/app.ts'
import type { File } from '../../models/fs/file.ts'
import generateThumbnail from './generate-thumbnail.ts'
import readThumbnailManifest from './read-thumbnail-manifest.ts'

const formatToMime = {
  jpg: 'image/jpeg',
  webp: 'image/webp',
  png: 'image/png',
  avif: 'image/avif',
}

const getThumbnail = async (
  app: App,
  metadata: File,
  size: 'xsm' | 'sm' | 'md' | 'lg' | 'xlg' | 'original',
  i: number = 0,
  format: 'jpg' | 'webp' | 'png' | 'avif' = 'jpg',
) => {
  const logger = app.logger.child({ module: 'core-logic.thumbnail.get-thumbnail' })
  const formatMimeType = formatToMime[format] || formatToMime.jpg

  const manifest = await readThumbnailManifest(app, metadata)
  if (!manifest?.images || i >= manifest.images.length) {
    return [null, null] as const
  }

  const fullThumbnailFolderPath = Path.join(app.thumbnailPath, manifest.path)
  const fullThumbnailPath = `${Path.join(fullThumbnailFolderPath, size, i.toString())}.${format}`
  const originalThumbnailPath = Path.join(fullThumbnailFolderPath, 'original', i.toString())
  let imageData: Buffer
  if (size === 'original') {
    imageData = await fs.readFile(originalThumbnailPath)
  } else {
    const thumbImageData = await fs.readFile(fullThumbnailPath).catch(() => null)
    if (thumbImageData) {
      imageData = thumbImageData
    } else {
      imageData = await generateThumbnail(originalThumbnailPath, fullThumbnailPath, size, format)
    }
  }

  logger.debug({
    size, i, format, path: metadata.path,
  }, 'Read thumbnail')
  return [{
    ...manifest.images[i],
    format: size === 'original' ? manifest.images[i].format : formatMimeType,
    path: fullThumbnailPath,
    data: imageData,
  }, manifest] as const
}

export default getThumbnail
