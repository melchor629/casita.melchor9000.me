import type { ItemMetadata } from '@/api/fs/media'
import CollapsableText from '../collapsable-text'
import { Folder } from '../icons'
import ItemChildren from './item-children'
import ItemPath from './item-path'
import ItemThumbnailImage from './item-thumbnail-image'
import Tags from './tags'

interface ArtistItemProps {
  readonly item: ItemMetadata & { type: 'artist' }
  readonly module: string
}

const ArtistItem = ({ item, module }: ArtistItemProps) => (
  <div>
    <div className="d-flex gap-3">
      <ItemThumbnailImage item={item} module={module} />
      <div>
        <h2>{item.title}</h2>
        <Tags type="Genres" tags={item.genres} />
        <Tags type="Styles" tags={item.styles} />
        <Tags type="Countries" tags={item.countries} />
        <div className="d-flex gap-2 mt-2">
          {item.paths.map((p) => (
            <ItemPath key={p} icon={Folder} module={module} path={p} />
          ))}
        </div>
      </div>
    </div>

    <CollapsableText className="lead my-4">
      {item.summary}
    </CollapsableText>

    <ItemChildren
      className="d-flex flex-row gap-4 px-4 overflow-auto"
      module={module}
      itemId={item.id}
    />
  </div>
)

export default ArtistItem
