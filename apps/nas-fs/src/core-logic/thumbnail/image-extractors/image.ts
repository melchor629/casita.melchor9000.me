import fs from 'node:fs/promises'
import type { File } from '../../../models/fs/file.ts'
import { type ExtractedImage, getMetadata } from './core.ts'

const getImagesFromImage = async (metadata: File): Promise<ExtractedImage[]> => {
  const data = await fs.readFile(metadata.realPath)
  return [
    {
      format: metadata.mime!.mime,
      data,
      originalSoftLink: true,
      ...(await getMetadata(data)),
    },
  ]
}

export default getImagesFromImage
