import { useMemo } from 'react'
import type { LibraryType } from '@/api/fs/media'
import {
  Folder,
  LiveTv,
  Movie,
  MusicNote,
  PhotoLibrary,
  type SvgIconProps,
} from '../icons'

interface LibraryTypeIconProps extends Omit<SvgIconProps, 'type'> {
  readonly type: LibraryType | null
}

export default function LibraryTypeIcon({ type, ...props }: LibraryTypeIconProps) {
  const Icon = useMemo(() => {
    if (type === 'music') {
      return MusicNote
    }

    if (type === 'movies') {
      return Movie
    }

    if (type === 'series') {
      return LiveTv
    }

    if (type === 'photos') {
      return PhotoLibrary
    }

    return Folder
  }, [type])

  return <Icon {...props} />
}
