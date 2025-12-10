import type { AudioTags } from './audio-tags'
import type { MediaInfo } from './mediainfo'
import type { Metadata } from './metadata'

export interface FileMetadata extends Metadata<'file'> {
  mediainfo?: MediaInfo
  audioTags?: AudioTags
  exif?: Record<
    'file'
    | 'jfif'
    | 'pngFile'
    | 'pngText'
    | 'png'
    | 'exif'
    | 'iptc'
    | 'xmp'
    | 'icc'
    | 'gps',
    object
  >
}
