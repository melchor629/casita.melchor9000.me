import { parseFile } from 'music-metadata'
import type { AudioPicture, AudioTags } from '../models/audio-tags.ts'

export const readTags = async (path: string): Promise<AudioTags> => {
  try {
    const { common: { picture, ...tags } } = await parseFile(path, { skipCovers: true })
    return tags
  } catch (e) {
    // TODO log error
    return {
      title: e instanceof Error ? e.message : '',
    }
  }
}

export const readCovers = async (path: string): Promise<AudioPicture[]> => {
  const tags = await parseFile(path)
  return tags.common.picture || []
}
