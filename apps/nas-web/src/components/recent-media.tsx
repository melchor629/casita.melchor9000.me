import { useEffect, useRef } from 'react'
import useRecentlyAddedMedia from '../hooks/api/use-recently-added-media'
import ReactRouterButton from './core/react-router-button'
import ReactRouterLink from './core/react-router-link'
import { Folder, Search } from './icons'
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
      <div className="d-flex justify-content-between mb-2">
        <h1>
          <ReactRouterLink to={type ? `/m/${module}/` : `/${module}/`}>
            <LibraryTypeIcon type={type} style={{ fontSize: 'calc(1.375rem + 1.5vw)' }} />
            <span style={{ verticalAlign: 'middle' }}>
              &nbsp;
              {name}
            </span>
          </ReactRouterLink>
        </h1>

        <div>
          {type && (
            <ReactRouterButton to={`/m/${module}/search`} className="mr-1">
              <Search style={{ fontSize: 'calc(1.375rem + 1.5vw)' }} />
            </ReactRouterButton>
          )}
          {type && (
            <ReactRouterButton to={`/${module}/`}>
              <Folder style={{ fontSize: 'calc(1.375rem + 1.5vw)' }} />
            </ReactRouterButton>
          )}
        </div>
      </div>

      {!recent.length && (
        <div className="d-flex align-items-center gap-2 mx-4">
          <span>Nothing special in here...</span>
        </div>
      )}

      <HorizontallyScrollableContainer ref={scrollableRef}>
        {recent.map((r) => <ItemCell key={r.id} item={r} module={module} />)}
      </HorizontallyScrollableContainer>
    </div>
  )
}
