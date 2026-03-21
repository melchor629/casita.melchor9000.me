import { styled } from '@melchor629/ui/utils'
import { VirtuosoGrid } from 'react-virtuoso'
import type { Item, LibraryType } from '@/api/fs/media'
import useMediaThumbnailSize from '@/hooks/use-media-thumbnail-size'
import ItemCell from './item-cell'

interface ItemsGridProps {
  readonly libraryType: LibraryType
  readonly items: Item[]
  readonly module: string
}

const sizes = {
  movies: 'movie' as const,
  music: 'album' as const,
  photos: 'album' as const, // TODO ?
  series: 'show' as const,
} satisfies Record<LibraryType, string>

const itemContent = (_: number, item: Item, module: string) => (
  <ItemCell
    item={item}
    module={module}
  />
)

const GridContainer = styled('div', 'GridContainer')({
  base: 'grid justify-around gap-y-4 gap-x-6 grid-cols-[repeat(auto-fill,var(--grid-item-width))]',
})

export default function ItemsGrid({ items, libraryType, module }: ItemsGridProps) {
  const { size: imageSize } = useMediaThumbnailSize(sizes[libraryType])
  return (
    <VirtuosoGrid
      data={items}
      context={module}
      components={{ List: GridContainer }}
      itemContent={itemContent}
      style={{ '--grid-item-width': `${imageSize.width}px` } as never}
    />
  )
}
