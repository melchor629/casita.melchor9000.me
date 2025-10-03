import type { App } from '../../../models/app.ts'
import type { MediaSourceRepository } from '../../../models/media.ts'
import * as plex from './plex.ts'

const getMediaRepository = (app: App): MediaSourceRepository | null => {
  if (app.mediaLibrary.plex) {
    return plex
  }

  return null
}

export default getMediaRepository
