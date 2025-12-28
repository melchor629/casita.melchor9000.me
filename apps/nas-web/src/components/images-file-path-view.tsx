import { animated, useTransition } from '@react-spring/web'
import {
  type FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getThumbnailUrl } from '../api/fs'
import type { FileMetadata } from '../api/fs/file'
import type { ThumbnailImage, ThumbnailManifest } from '../api/fs/thumbnail-manifest'
import useApiClient from '../hooks/use-api-client'
import { getManifest } from '../utils/thumbnail-manager'

const ImagesSlideShow: FC<{ readonly images: Array<ThumbnailImage & { url: string }> }> = ({ images }) => {
  const imgs = useMemo(() => images.map((img, i) => ({ ...img, key: img.type ?? i })), [images])
  const [imgPos, setImgPos] = useState(0)
  const [maxWidth, maxHeight] = useMemo(
    () => images
      .map((i) => [i.width ?? 0, i.height ?? 0])
      .reduce(([aw, ah], [w, h]) => [Math.max(aw, w), Math.max(ah, h)], [0, 0]),
    [images],
  )
  const [allowedWidth, setAllowedWidth] = useState(1)
  const allowedHeight = useMemo(
    () => (maxHeight / maxWidth) * allowedWidth,
    [allowedWidth, maxWidth, maxHeight],
  )
  const divRef = useRef<HTMLDivElement>(null)
  const transition = useTransition(imgs[imgPos], {
    keys: ({ key }) => key,
    from: { opacity: 0, position: 'absolute' as const },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setAllowedWidth(entry.contentRect.width)
    })
    observer.observe(divRef.current!)
    setAllowedWidth(divRef.current!.getBoundingClientRect().width)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const n = setInterval(() => {
      setImgPos((p) => (p + 1) % imgs.length)
    }, 5000)

    return () => clearInterval(n)
  }, [imgs.length])

  return (
    <div ref={divRef} className="flex justify-center w-full">
      <div
        className="relative"
        style={{
          width: Math.min(allowedWidth, maxWidth),
          height: Math.min(allowedHeight, maxHeight),
        }}
      >
        {transition((style, item) => (
          <animated.img
            src={item.url}
            className="block"
            alt={item.type ?? 'Image extracted from the resource'}
            style={{ ...style, willChange: 'opacity' }}
          />
        ))}
      </div>
    </div>
  )
}

interface ImagesFilePathViewProps {
  readonly module: string
  readonly metadata: FileMetadata
}

export default function ImagesFilePathView({ metadata, module }: ImagesFilePathViewProps) {
  const [thumbnailManifest, setThumbnailManifest] = useState<ThumbnailManifest | null>(null)
  const apiClient = useApiClient()
  const [token, setToken] = useState<string | null>()

  useEffect(() => {
    const ac = new AbortController()
    getManifest(apiClient, module, metadata, ac.signal)
      .then(setThumbnailManifest)
      .catch(() => setThumbnailManifest(null))

    return () => ac.abort()
  }, [module, metadata, apiClient])

  useEffect(() => {
    apiClient.getAccessToken().then(setToken).catch(() => setToken(null))
  }, [apiClient])

  if (!thumbnailManifest?.images?.length || !token) {
    return null
  }

  const altImages = thumbnailManifest.images.map((img, i) => ({
    ...img,
    url: `${getThumbnailUrl(module, metadata.path, { size: 'original', i })}&token=${token}`,
  }))
  return <ImagesSlideShow images={altImages} />
}
