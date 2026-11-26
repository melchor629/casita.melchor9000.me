import type { File } from '../../../models/fs/file.ts'
import { readCovers } from '../../../parsers/audio-tags.ts'
import { type ExtractedImage, getMetadata } from './core.ts'

const getImagesFromAudio = async (metadata: File): Promise<ExtractedImage[]> => {
  const covers = await readCovers(metadata.realPath)
  return Promise.all(
    covers.map(async (cover) =>
      Object.assign(await getMetadata(cover.data), {
        format: cover.format,
        data: cover.data,
        type: cover.name,
      }),
    ),
  )
}

export default getImagesFromAudio
