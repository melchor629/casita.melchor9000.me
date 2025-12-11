import { type HTMLProps, useCallback, useMemo, useState } from 'react'
import { getDownloadUrl } from '@/api/fs'
import type { Item } from '@/api/fs/media'
import useApiClient from '@/hooks/use-api-client'
import useMediaThumbnailSize from '@/hooks/use-media-thumbnail-size'
import Button from '../core/button'
import ReactRouterLink from '../core/react-router-link'
import { Download, Downloading } from '../icons'
import ItemThumbnailImage from './item-thumbnail-image'

interface ItemCellProps {
  readonly item: Item
  readonly module: string
  readonly style?: HTMLProps<HTMLDivElement>['style']
}

export default function ItemCell({ item, module, style }: ItemCellProps) {
  const apiClient = useApiClient()
  const { size: { width } } = useMediaThumbnailSize(item.type)
  const [preparing, setPreparing] = useState(false)

  const extraContent = useMemo(() => {
    if (item.type === 'album') {
      return (
        <ReactRouterLink to={`/m/${module}/${item.artistId}`} underline="hover">
          <small>
            {item.artistTitle}
            {item.year && ` (${item.year})`}
          </small>
        </ReactRouterLink>
      )
    }

    if (item.type === 'show' && item.year) {
      return <small>{item.year}</small>
    }

    if (item.type === 'movie' && item.year) {
      return <small>{item.year}</small>
    }

    if (item.type === 'season' && item.year) {
      return <small>{item.year}</small>
    }

    return null
  }, [module, item])

  const linkUrl = useMemo(() => (
    item.type === 'episode'
      ? `/${module}${item.paths[0]}`
      : `/m/${module}/${item.id}`
  ), [item, module])

  const download = useCallback(() => {
    if (item.type === 'episode') {
      setPreparing(true)
      getDownloadUrl(module, item.paths[0], apiClient)
        .then((url) => {
          window.location.assign(url)
        })
        .catch(() => {})
        .finally(() => setPreparing(false))
    }
  }, [module, item, apiClient])

  return (
    <div className="text-center" style={{ width, ...style }}>
      <ReactRouterLink to={linkUrl}>
        <ItemThumbnailImage module={module} item={item} forceLoadImage={style ? true : undefined} />
      </ReactRouterLink>
      <div className="pt-2 lh-sm">
        <span className="w-100 d-inline-block text-truncate">
          {item.title}
        </span>
        {extraContent && (
          <span className="w-100 d-inline-block text-truncate">
            {extraContent}
          </span>
        )}
        {item.type === 'episode' && (
          <Button variant="text" size="small" color="secondary" disabled={preparing} onClick={download}>
            {preparing ? <Downloading /> : <Download />}
          </Button>
        )}
      </div>
    </div>
  )
}
