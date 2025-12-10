import { useMediaLibraryItemChildren } from '@/hooks/api/use-media-library-item-children'
import ItemCell from './item-cell'

interface ItemChildrenProps {
  readonly className: string
  readonly module: string
  readonly itemId: string
}

const ItemChildren = ({ className, itemId, module }: ItemChildrenProps) => {
  const { data } = useMediaLibraryItemChildren(module, itemId)

  return (
    <div className={className}>
      {data?.items.map((itemChild) => (
        <ItemCell key={itemChild.id} item={itemChild} module={module} />
      ))}
    </div>
  )
}

export default ItemChildren
