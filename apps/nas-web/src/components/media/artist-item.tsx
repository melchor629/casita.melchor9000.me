import { CollapsableText } from '@melchor629/ui'
import { Folder } from '@melchor629/ui/icons'
import type { ItemMetadata } from '@/api/fs/media'
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
    <div className="flex gap-6">
      <ItemThumbnailImage
        item={item}
        module={module}
      />
      <div>
        <h2 className="text-h2">{item.title}</h2>
        <Tags
          type="Genres"
          tags={item.genres}
        />
        <Tags
          type="Styles"
          tags={item.styles}
        />
        <Tags
          type="Countries"
          tags={item.countries}
        />
        <div className="my-4 flex gap-3">
          {item.paths.map((p) => (
            <ItemPath
              key={p}
              icon={Folder}
              module={module}
              path={p}
            />
          ))}
        </div>
      </div>
    </div>

    <CollapsableText className="text-body-large my-6">{item.summary}</CollapsableText>

    <ItemChildren
      className="flex flex-row gap-6 overflow-auto px-4"
      module={module}
      itemId={item.id}
    />
  </div>
)

export default ArtistItem
