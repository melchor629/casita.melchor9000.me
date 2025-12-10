import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ItemMetadata } from '@/api/fs/media'
import { useMediaLibraryItemChildren } from '@/hooks/api/use-media-library-item-children'
import { dirname } from '@/utils/path'
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
      <div className="d-flex gap-3">
        <ItemThumbnailImage item={item} module={module} />
        <div>
          <h2>{item.title}</h2>
          <div>
            <strong>Serie:</strong>
            <span> </span>
            <Link to={`/m/${module}/${item.serieId}`}>{item.serieTitle}</Link>
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
          <div className="d-flex flex-wrap gap-2 my-2">
            {folderLinks}
          </div>
        </div>
      </div>

      <ItemChildren
        className="d-flex flex-row flex-wrap gap-4 px-4 my-4"
        module={module}
        itemId={item.id}
      />
    </div>
  )
}

export default SeasonItem
