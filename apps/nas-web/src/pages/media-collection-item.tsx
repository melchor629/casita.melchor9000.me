import { Helmet } from '@dr.pogodin/react-helmet'
import { useMemo } from 'react'
import { type LoaderFunction, useParams } from 'react-router'
import { Spinner } from '../components/loaders'
import AlbumItem from '../components/media/album-item'
import ArtistItem from '../components/media/artist-item'
import MovieItem from '../components/media/movie-item'
import SeasonItem from '../components/media/season-item'
import ShowItem from '../components/media/show-item'
import NavbarBackdropFilter from '../components/navbar-backdrop-filter'
import { useMediaLibraryItem, fetchMediaLibraryItem } from '../hooks/api/use-media-library-item'
import { prefetchMediaLibraryItemChildren } from '../hooks/api/use-media-library-item-children'

export const loader: LoaderFunction = async ({ params: { itemId, module } }) => {
  const item = await fetchMediaLibraryItem(module, itemId)
  if (item && ['album', 'artist', 'show', 'season'].includes(item.type)) {
    await prefetchMediaLibraryItemChildren(module, itemId)
  }
}

export default function MediaCollectionItemPage() {
  const { itemId, module } = useParams()
  const { data: itemMetadata, isLoading } = useMediaLibraryItem(module, itemId)

  const itemElement = useMemo(() => {
    if (!itemMetadata || !module) {
      return null
    }

    if (itemMetadata.type === 'album') {
      return <AlbumItem item={itemMetadata} module={module} />
    }

    if (itemMetadata.type === 'artist') {
      return <ArtistItem item={itemMetadata} module={module} />
    }

    if (itemMetadata.type === 'movie') {
      return <MovieItem item={itemMetadata} module={module} />
    }

    if (itemMetadata.type === 'show') {
      return <ShowItem item={itemMetadata} module={module} />
    }

    if (itemMetadata.type === 'season') {
      return <SeasonItem item={itemMetadata} module={module} />
    }

    return null
  }, [module, itemMetadata])

  const title = useMemo(() => {
    if (itemMetadata?.type === 'season') {
      return `${itemMetadata.title} - ${itemMetadata.serieTitle}`
    }

    if (itemMetadata?.type === 'album') {
      return `${itemMetadata.title} - ${itemMetadata.artistTitle}`
    }

    return itemMetadata?.title
  }, [itemMetadata])

  return (
    <>
      <Helmet>
        {title && <title>{title}</title>}
      </Helmet>

      <NavbarBackdropFilter />

      <div className="px-4 md:px-6 pb-5 pt-navbar mt-4">
        {isLoading && (
          <div
            className="text-center fixed w-full pt-4 top-navbar"
          >
            <Spinner size="lg" />
          </div>
        )}

        {!isLoading && !itemMetadata && (
          <div className="text-center text-body-large text-text-secondary">
            Item not found
          </div>
        )}

        {itemElement}
      </div>
    </>
  )
}
