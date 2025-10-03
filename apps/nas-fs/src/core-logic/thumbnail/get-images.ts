import type { File } from '../../models/fs/file.ts'
import getImagesFromAudio from './image-extractors/audio.ts'
import { type ExtractedImage } from './image-extractors/core.ts'
import getImagesFromImage from './image-extractors/image.ts'
import getImagesFromVideo from './image-extractors/video.ts'

const getImages = async (metadata: File): Promise<ExtractedImage[]> => {
  if (!metadata.mime || metadata.mime.isText) {
    return []
  }

  const { mime } = metadata.mime
  if (mime.startsWith('image')) {
    return getImagesFromImage(metadata)
  }

  if (mime.startsWith('audio')) {
    return getImagesFromAudio(metadata)
  }

  if (mime.startsWith('video')) {
    return getImagesFromVideo(metadata)
  }

  return []
}

export default getImages
