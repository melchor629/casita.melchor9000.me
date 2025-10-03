import sharp from 'sharp'

export type ExtractedImage = Readonly<{
  format: string
  data: Uint8Array
  type?: string
  originalSoftLink?: boolean
  decoder?: string
  width?: number
  height?: number
  hasAlpha?: boolean
  rotation?: 0 | 90 | 180 | 270
}>

// https://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/
const exifOrientationToDegrees: readonly ExtractedImage['rotation'][] = [0, 0, undefined, 180, undefined, undefined, 270, undefined, 90]

export const getMetadata = (buffer: Buffer | Uint8Array) => (
  sharp(buffer)
    .metadata()
    .then((metadata) => ({
      decoder: metadata.format,
      width: metadata.width,
      height: metadata.height,
      hasAlpha: metadata.hasAlpha,
      rotation: exifOrientationToDegrees[metadata.orientation ?? 0],
    }))
)
