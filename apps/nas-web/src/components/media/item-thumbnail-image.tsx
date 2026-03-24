import { CircularProgress } from '@melchor629/ui'
import { styled } from '@melchor629/ui/utils'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getItemThumbnail } from '@/api/fs'
import type { Item } from '@/api/fs/media'
import useApiClient from '@/hooks/use-api-client'
import useDevicePixelRatio from '@/hooks/use-device-pixel-ratio'
import useMediaThumbnailSize from '@/hooks/use-media-thumbnail-size'

interface ItemImageProps {
  readonly item: Item
  readonly module: string
  readonly forceLoadImage?: true
}

const LoadingContainer = styled('div', 'LoadingContainer')({
  base: 'absolute left-0 top-0 bg-elevated-0/25',
})

const ChildrenCount = styled('div', 'ChildrenCount')({
  base: 'absolute right-3 top-2 px-1 py-0.5 text-xs text-text-main bg-elevated-0/65 border border-elevated-border rounded-sm select-none',
})

const ImageThumbnail = styled('img', 'ImageThumbnail')({
  base: 'min-h-1.5 rounded-md shadow-md hover:shadow-lg hover:opacity-75 transition-all',
})

const blobCache = new Map<string, readonly [url: string, blob: Blob]>()

export default function ItemThumbnailImage({ forceLoadImage, item, module }: ItemImageProps) {
  const apiClient = useApiClient()
  const [loading, setLoading] = useState<boolean | null>(forceLoadImage ? false : null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const thumbnail = item.type !== 'genre' ? item.thumbnail : undefined
  const intersectionObserver = useMemo(() => (
    new IntersectionObserver(
      (info) => {
        if (info.length > 0 && info[0].isIntersecting) {
          setLoading((v) => (v == null ? false : v))
        }
      },
      { root: document.body, rootMargin: '10px' },
    )
  ), [])
  const { size } = useMediaThumbnailSize(item.type)
  const dpr = useDevicePixelRatio()

  const childrenCount = useMemo(() => {
    if (item.type === 'collection') {
      return item.itemCount
    }

    if (item.type === 'season') {
      return item.episodes
    }

    if (item.type === 'show') {
      return item.seasons
    }

    return null
  }, [item])

  useEffect(() => {
    if (thumbnail) {
      if (loading == null) {
        return
      }

      const imgSize = {
        width: Math.round(size.width * dpr),
        height: size.height ? Math.round(size.height * dpr) : undefined,
      }
      const key = `${module}:${thumbnail.itemId}:${thumbnail.imageKey}:${imgSize.width}x${imgSize.height}`
      if (blobCache.has(key)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImageUrl(blobCache.get(key)![0])
      } else {
        (async () => {
          setLoading(true)
          const blob = await getItemThumbnail(
            apiClient,
            module,
            thumbnail.itemId,
            thumbnail.imageKey,
            imgSize,
          )
          if (blob) {
            const url = URL.createObjectURL(blob)
            blobCache.set(key, [url, blob])
            setImageUrl(url)
          } else {
            // TODO use generic image
          }
        })()
          .catch(() => {
            setImageUrl(null)
            blobCache.set(key, [null!, null!])
            // TODO use generic image
          })
          .finally(() => setLoading(false))
      }
    } else {
      setImageUrl(null)
    }
  }, [apiClient, module, item.id, thumbnail, size, loading, dpr])

  return (
    <div
      ref={useCallback((div: HTMLDivElement) => {
        if (div) {
          intersectionObserver.observe(div)
        } else {
          intersectionObserver.disconnect()
        }
      }, [intersectionObserver])}
      className="relative min-h-24"
      style={size}
    >
      {imageUrl && (
        <ImageThumbnail
          {...size}
          src={imageUrl}
          alt={`${item.title} cover`}
        />
      )}
      {loading !== false && (
        <LoadingContainer
          className="w-full h-full flex justify-center items-center"
        >
          <CircularProgress size="large" />
        </LoadingContainer>
      )}
      {childrenCount != null && (
        <ChildrenCount>{childrenCount}</ChildrenCount>
      )}
    </div>
  )
}
