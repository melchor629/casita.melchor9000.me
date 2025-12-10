import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ItemMetadata } from '@/api/fs/media'
import { useMediaLibraryItemChildren } from '@/hooks/api/use-media-library-item-children'
import { humanDuration } from '@/utils/number-format'
import { dirname } from '@/utils/path'
import CollapsableText from '../collapsable-text'
import { File, Folder } from '../icons'
import ItemPath from './item-path'
import ItemThumbnailImage from './item-thumbnail-image'
import Tags from './tags'

interface AlbumItemProps {
  readonly item: ItemMetadata & { type: 'album' }
  readonly module: string
}

const AlbumItem = ({ item, module }: AlbumItemProps) => {
  const { data: itemChildren } = useMediaLibraryItemChildren(module, item.id)
  const folderLinks = useMemo(() => [
    ...item.paths,
    ...new Set(
      itemChildren
        ?.items
        .flatMap((ic) => (ic.type === 'track' ? ic.paths : []))
        .map((p) => dirname(p)),
    ),
  ].map((p) => (
    <ItemPath key={p} icon={Folder} module={module} path={p} />
  )), [itemChildren, item.paths, module])

  return (
    <div>
      <div className="d-flex gap-3">
        <ItemThumbnailImage item={item} module={module} />
        <div>
          <h2>{item.title}</h2>
          <h3>
            <Link to={`/m/${module}/${item.artistId}`}>
              {item.artistTitle}
            </Link>
          </h3>
          <div className="d-flex gap-2">
            <span>{item.year}</span>
            {item.rating && <span>{`${item.rating}/10`}</span>}
          </div>
          <Tags type="Genres" tags={item.genres} />
          <Tags type="Styles" tags={item.styles} />
          <div className="d-flex flex-wrap gap-2 my-2">
            {folderLinks}
          </div>
        </div>
      </div>

      <CollapsableText className="lead my-4">
        {item.summary}
      </CollapsableText>

      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              {/* @ts-expect-error don't know why... */}
              <th scope="col" width="100%">Title</th>
              <th scope="col">Duration</th>
              <th scope="col"><span className="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {itemChildren?.items.map((child, i) => child.type === 'track' && (
              <tr key={child.id}>
                <th scope="row">{i + 1}</th>
                <td>{child.title}</td>
                <td>{humanDuration(child.duration)}</td>
                <td>
                  <Link to={`/${module}${child.paths[0]}`} className="px-2" aria-label="Album files">
                    <File height="1rem" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AlbumItem
