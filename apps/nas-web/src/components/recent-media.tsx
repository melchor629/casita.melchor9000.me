import ReactRouterButton from '@melchor629/ui/ReactRouterButton'
import { Folder, Search } from '@melchor629/ui/icons'
import { useEffect, useRef } from 'react'
import useRecentlyAddedMedia from '../hooks/api/use-recently-added-media'
import HorizontallyScrollableContainer from './media/horizontally-scrollable-container'
import ItemCell from './media/item-cell'
import LibraryTypeIcon from './media/library-type-icon'

export default function RecentMedia({ module, name }: { readonly module: string, readonly name: string }) {
  const { data } = useRecentlyAddedMedia(module)
  const scrollableRef = useRef<HTMLDivElement>(null)

  const type = data.libraryType || null
  const recent = data.items
  const mostRecentId = recent[0]?.id

  useEffect(() => {
    scrollableRef.current?.scrollTo({
      left: 0,
      behavior: 'smooth',
    })
  }, [mostRecentId])

  if (!recent.length) {
    return null
  }

  return (
    <div className="mb-3">
      <div className="flex justify-between">
        <ReactRouterButton
          to={type ? `/m/${module}/` : `/${module}/`}
          size="large"
          className="text-h2"
          icon={<LibraryTypeIcon type={type} className="text-h1" />}
        >
          <span>{name}</span>
        </ReactRouterButton>

        <div>
          {type && (
            <ReactRouterButton to={`/m/${module}/search`} size="large" color="neutral" className="mr-1" title="Search media">
              <Search className="text-h1" />
            </ReactRouterButton>
          )}
          {type && (
            <ReactRouterButton to={`/${module}/`} size="large" color="neutral" title="Navigate through files">
              <Folder className="text-h1" />
            </ReactRouterButton>
          )}
        </div>
      </div>

      {!recent.length && (
        <div className="flex items-center gap-2 mt-2 mx-4">
          <span>Nothing special in here...</span>
        </div>
      )}

      <HorizontallyScrollableContainer ref={scrollableRef}>
        {recent.map((r) => <ItemCell key={r.id} item={r} module={module} />)}
      </HorizontallyScrollableContainer>
    </div>
  )
}
