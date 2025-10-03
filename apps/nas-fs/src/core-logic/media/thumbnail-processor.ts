import fs from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import type { App } from '../../models/app.ts'
import type { MediaSourceRepository } from '../../models/media.ts'

type ThumbnailOptions = {
  mediaKey: string
  thumbnailKey: string
  format?: 'webp' | 'avif' | 'png' | 'jpeg'
  size?: readonly [width: number, height: number] | 'original'
}

const getMediaThumbnail = async (app: App, mediaRepository: MediaSourceRepository, {
  format = 'jpeg',
  mediaKey,
  size,
  thumbnailKey,
}: ThumbnailOptions) => {
  if (size === 'original') {
    return mediaRepository.getThumbnail(app, mediaKey, thumbnailKey)
  }

  const cacheFolderPath = join(
    app.thumbnailPath,
    '_media',
    mediaKey,
    size ? `${size[0]}x${size[1]}` : 'original',
  )
  const cacheFilePath = join(
    cacheFolderPath,
    `${thumbnailKey}.${format}`,
  )

  const cacheExists = await fs.access(cacheFilePath, fs.constants.R_OK).catch(() => null)
  if (cacheExists) {
    return {
      contentType: `image/${format}`,
      path: cacheFilePath,
      cacheControl: 'max-age=86400',
    }
  }

  const result = await mediaRepository.getThumbnail(app, mediaKey, thumbnailKey)
  if (!result) {
    return null
  }

  let image = sharp(result.data)
  if (size) {
    image = image.resize(size[0], size[1])
  }

  if (format === 'avif') {
    image = image.avif()
  } else if (format === 'jpeg') {
    image = image.jpeg()
  } else if (format === 'png') {
    image = image.png()
  } else if (format === 'webp') {
    image = image.webp()
  }

  await fs.mkdir(cacheFolderPath, { recursive: true })
  await image.toFile(cacheFilePath)
  return {
    contentType: `image/${format}`,
    path: cacheFilePath,
    cacheControl: 'max-age=86400',
  }
}

export default getMediaThumbnail
