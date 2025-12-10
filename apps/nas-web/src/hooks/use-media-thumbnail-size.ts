import { useMemo } from 'react'
import type { Item } from '../api/fs/media'
import useMatchMediaQuery from './use-match-media-query'

const sizes = {
  actor: { width: 150, height: 150 },
  album: { width: 200, height: 200 },
  artist: { width: 200, height: 200 },
  collection: { width: 200, height: 300 },
  director: { width: 150, height: 150 },
  episode: { width: 300, height: undefined },
  genre: { width: 150, height: 150 },
  movie: { width: 200, height: 300 },
  season: { width: 200, height: 300 },
  show: { width: 200, height: 300 },
  track: { width: 200, height: 200 },
} satisfies Record<Item['type'], { width: number, height?: number }>

const useMediaThumbnailSize = (type: Item['type']) => {
  const isSmallScreen = useMatchMediaQuery('(max-width: 767.98px)')
  const isHugeScreen = useMatchMediaQuery('(min-width: 1400px)')
  const scale = useMemo(() => {
    if (isSmallScreen) {
      return 0.76
    }
    if (isHugeScreen) {
      return 1.26
    }

    return 1
  }, [isSmallScreen, isHugeScreen])
  const size = useMemo(() => {
    const s = sizes[type]
    return {
      width: s.width * scale,
      height: s.height ? s.height * scale : undefined,
    }
  }, [type, scale])

  return { size, scale }
}

export default useMediaThumbnailSize
