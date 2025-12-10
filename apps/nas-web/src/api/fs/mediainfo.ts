export type MediaInfoTrack = Record<string, string> & {
  '@type': 'General' | 'Video' | 'Audio' | 'Text' | 'Image' | 'Chapters' | 'Menu'
  '@typeorder'?: `${number}`
  extra?: Record<string, string>
}

export interface MediaInfo {
  creatingLibrary: {
    name: string
    version: string
    url: string
  }
  media: {
    '@ref': string
    track: MediaInfoTrack[]
  }
}
