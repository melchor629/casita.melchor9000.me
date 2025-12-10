export interface ThumbnailImage {
  format: string
  type?: string
  decoder?: string
  width?: number
  height?: number
  hasAlpha?: boolean
  rotation?: 0 | 90 | 180 | 270
}

export interface ThumbnailManifest {
  modificationTime: string
  images: ThumbnailImage[] | null
}

export interface ThumbnailRequestOptions {
  size?: 'xsm' | 'sm' | 'md' | 'lg' | 'xlg' | 'original'
  format?: 'jpg' | 'png' | 'webp' | 'avif'
  i?: number
}
