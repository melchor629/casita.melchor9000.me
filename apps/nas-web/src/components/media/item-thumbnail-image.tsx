import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { styled } from 'styled-components'
import { getItemThumbnail } from '@/api/fs'
import type { Item } from '@/api/fs/media'
import useApiClient from '@/hooks/use-api-client'
import useDevicePixelRatio from '@/hooks/use-device-pixel-ratio'
import useMediaThumbnailSize from '@/hooks/use-media-thumbnail-size'
import { Spinner } from '../loaders'

interface ItemImageProps {
  readonly item: Item
  readonly module: string
  readonly forceLoadImage?: true
}

const LoadingContainer = styled('div')`
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(var(--bs-body-bg-rgb), 0.25);
`

const ChildrenCount = styled('div')`
  position: absolute;
  right: 0.75rem;
  top: 0.5rem;
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
  color: rgb(var(--bs-body-color-rgb));
  background-color: rgba(var(--bs-body-bg-rgb), 0.55);
  border: 1px solid rgba(var(--bs-secondary-bg-rgb), 0.75);
  border-radius: 3px;
  user-select: none;
`

const ImageThumbnail = styled('img')`
  min-height: 6rem;
  box-shadow: 0 0 10px 1px rgb(10 10 10 / 40%);
  transition: box-shadow 75ms ease-in-out;

  &:hover {
    box-shadow: 0 0 8px 0 rgb(10 10 10 / 50%);
  }
`

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
      style={{ ...size, position: 'relative', minHeight: '6rem' }}
    >
      {imageUrl && (
        <ImageThumbnail
          {...size}
          src={imageUrl}
          alt={`${item.title} cover`}
          className="rounded"
        />
      )}
      {loading !== false && (
        <LoadingContainer
          className="w-100 h-100 d-flex justify-content-center align-items-center"
        >
          <Spinner size="lg" />
        </LoadingContainer>
      )}
      {childrenCount != null && (
        <ChildrenCount>{childrenCount}</ChildrenCount>
      )}
    </div>
  )
}
