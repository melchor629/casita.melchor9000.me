import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ItemMetadata } from '@/api/fs/media'
import { useMediaLibraryItemChildren } from '@/hooks/api/use-media-library-item-children'
import { humanDuration } from '@/utils/number-format'
import { dirname } from '@/utils/path'
import CollapsableText from '../collapsable-text'
import ReactRouterButton from '../core/react-router-button'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeaderCell, TableRow } from '../core/table'
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
      <div className="flex gap-6">
        <ItemThumbnailImage item={item} module={module} />
        <div>
          <h2 className="text-h2">{item.title}</h2>
          <h3>
            <Link to={`/m/${module}/${item.artistId}`}>
              {item.artistTitle}
            </Link>
          </h3>
          <div className="flex gap-3">
            <span>{item.year}</span>
            {item.rating && <span>{`${item.rating}/10`}</span>}
          </div>
          <Tags type="Genres" tags={item.genres} />
          <Tags type="Styles" tags={item.styles} />
          <div className="flex gap-3 my-4">
            {folderLinks}
          </div>
        </div>
      </div>

      <CollapsableText className="text-body-large my-6">
        {item.summary}
      </CollapsableText>

      <TableContainer>
        <Table hover>
          <TableHead>
            <TableRow>
              <TableHeaderCell>#</TableHeaderCell>
              {/* @ts-expect-error don't know why... */}
              <TableHeaderCell width="100%">Title</TableHeaderCell>
              <TableHeaderCell>Duration</TableHeaderCell>
              <TableHeaderCell><span className="invisible">Actions</span></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemChildren?.items.map((child, i) => child.type === 'track' && (
              <TableRow key={child.id}>
                <TableHeaderCell>{i + 1}</TableHeaderCell>
                <TableCell>{child.title}</TableCell>
                <TableCell>{humanDuration(child.duration)}</TableCell>
                <TableCell>
                  <ReactRouterButton
                    to={`/${module}${child.paths[0]}`}
                    aria-label="Album files"
                    icon={<File />}
                    size="small"
                    color="neutral"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default AlbumItem
