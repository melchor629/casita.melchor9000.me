import { useMemo } from 'react'
import type { ItemMetadata } from '@/api/fs/media'
import { useMediaLibraryItemChildren } from '@/hooks/api/use-media-library-item-children'
import { dirname } from '@/utils/path'
import ReactRouterLink from '../core/react-router-link'
import { Folder } from '../icons'
import ItemChildren from './item-children'
import ItemPath from './item-path'
import ItemThumbnailImage from './item-thumbnail-image'

interface SeasonItemProps {
  readonly item: ItemMetadata & { type: 'season' }
  readonly module: string
}

const SeasonItem = ({ item, module }: SeasonItemProps) => {
  const { data: itemChildren } = useMediaLibraryItemChildren(module, item.id)
  const folderLinks = useMemo(() => [...new Set(
    itemChildren
      ?.items
      .flatMap((ic) => (ic.type === 'episode' ? ic.paths : []))
      .map((p) => dirname(p)),
  )].map((p) => (
    <ItemPath key={p} icon={Folder} module={module} path={p} />
  )), [itemChildren, module])

  return (
    <div>
      <div className="flex gap-6">
        <ItemThumbnailImage item={item} module={module} />
        <div>
          <h2 className="text-h2">{item.title}</h2>
          <div>
            <strong>Serie:</strong>
            <span> </span>
            <ReactRouterLink to={`/m/${module}/${item.serieId}`} underline>{item.serieTitle}</ReactRouterLink>
          </div>
          <div>
            <strong>Episodes:</strong>
            <span> </span>
            <span>{item.episodes}</span>
          </div>
          <div>
            <strong>Studio:</strong>
            <span> </span>
            <span>{item.studio}</span>
          </div>
          <div className="flex gap-3 my-4">
            {folderLinks}
          </div>
        </div>
      </div>

      <ItemChildren
        className="flex flex-row flex-wrap gap-x-6 gap-y-4 px-4 my-10"
        module={module}
        itemId={item.id}
      />
    </div>
  )
}

export default SeasonItem
