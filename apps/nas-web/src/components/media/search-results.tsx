import debounce from 'lodash-es/debounce'
import { useEffect, useMemo, useState, useTransition } from 'react'
import type { SearchResults as SearchResultsType } from '@/api/fs/media'
import useMediaLibrarySearchResults from '@/hooks/api/use-media-library-search-results'
import { Spinner } from '../loaders'
import HorizontallyScrollableContainer from './horizontally-scrollable-container'
import ItemCell from './item-cell'

interface SearchResultsProps {
  readonly module: string
  readonly searchFilter: string
}

const areaTitles = Object.freeze({
  actor: 'Actors',
  album: 'Albums',
  artist: 'Artists',
  collection: 'Collections',
  director: 'Directors',
  episode: 'Episodes',
  genre: 'Genres',
  movie: 'Movies',
  season: 'Seasons',
  show: 'Shows',
  track: 'Tracks',
} satisfies Record<SearchResultsType['areas'][0]['type'], string>)

export default function SearchResults({ module, searchFilter }: SearchResultsProps) {
  const [delayedSearchFilter, setDelayedSearchFilter] = useState(searchFilter)
  const { data: results } = useMediaLibrarySearchResults(module, delayedSearchFilter)
  const [isLoading, startTransition] = useTransition()

  const updateFilter = useMemo(() => debounce((value: string) => {
    startTransition(() => {
      setDelayedSearchFilter(value)
    })
  }, 500, { leading: true }), [])

  useEffect(() => {
    updateFilter(searchFilter)
  }, [updateFilter, searchFilter])

  if (isLoading && !results) {
    return (
      <div className="text-center w-100">
        <Spinner size="lg" />
      </div>
    )
  }

  if (delayedSearchFilter.length <= 1) {
    return (
      <div className="text-center lead text-muted w-100">
        Type something above to start searching…
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {!!results?.areas.length && results.areas.map((area) => (
        <div key={area.type} className="mb-2" role="region">
          <h2>{areaTitles[area.type]}</h2>
          <HorizontallyScrollableContainer>
            {area.results.map((areaResult) => (
              <ItemCell key={areaResult.id} item={areaResult} module={module} />
            ))}
          </HorizontallyScrollableContainer>
        </div>
      ))}

      {results && !results.areas.length && (
        <div className="text-center lead text-muted w-100">
          No results with the provided search.
        </div>
      )}

      {isLoading && (
        <div className="text-center w-100 h-100" style={{ position: 'absolute', top: 0, left: 0 }}>
          <Spinner size="lg" />
        </div>
      )}
    </div>
  )
}
