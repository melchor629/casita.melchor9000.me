import type { App } from '../../../models/app.ts'
import type {
  Item,
  ItemChildrenOptions,
  ItemMetadata,
  Rating,
  SearchResultArea,
  SearchResultItem,
  SearchResults,
  ThumbnailStream,
} from '../../../models/media.ts'
import * as plex from '../client/plex.ts'

const thumbnailRegex = /^\/library\/metadata\/([a-zA-Z0-9]+)\/thumb\/([a-zA-Z0-9]+)/
const extractImageReference = (path?: string | null) => {
  if (!path) {
    return null
  }

  const match = thumbnailRegex.exec(path)
  const ref = match && match.length >= 3
    ? { itemId: match[1], imageKey: match[2] }
    : null
  return ref
}

const getLibrary = async (app: App): Promise<plex.Library | null> => {
  const libraries = await plex.getLibraries()
  const library = libraries?.Directory.find((l) => l.key === app.mediaLibrary.plex!)
  return library || null
}

const mapItem = (library: plex.Library, item: plex.LibraryContents['Metadata'][0]): Item => {
  const paths = library.Location.map((l) => l.path)
  const thumbnail = extractImageReference(item.thumb)
  if (item.type === 'album') {
    return {
      type: 'album',
      artistId: item.parentRatingKey,
      artistTitle: item.parentTitle,
      id: item.ratingKey,
      thumbnail,
      title: item.title,
      year: item.year,
    }
  }

  if (item.type === 'artist') {
    return {
      type: 'artist',
      id: item.ratingKey,
      thumbnail,
      title: item.title,
    }
  }

  if (item.type === 'episode') {
    return {
      type: 'episode',
      duration: item.duration / 1000,
      id: item.ratingKey,
      seasonId: item.parentRatingKey,
      seasonTitle: item.parentTitle,
      serieId: item.grandparentRatingKey,
      serieTitle: item.grandparentTitle,
      summary: item.summary,
      thumbnail,
      title: item.title,
      paths: item.Media.flatMap((media) => (
        media.Part.map((part) => paths.reduce((v, p) => v.replace(p, ''), part.file))
      )),
    }
  }

  if (item.type === 'movie') {
    return {
      type: 'movie',
      duration: item.duration / 1000,
      id: item.ratingKey,
      summary: item.summary,
      thumbnail,
      title: item.title,
      year: item.year,
    }
  }

  if (item.type === 'season') {
    return {
      type: 'season',
      episodes: item.leafCount,
      id: item.ratingKey,
      serieId: item.parentRatingKey,
      serieTitle: item.parentTitle,
      summary: item.summary,
      thumbnail,
      title: item.title,
      year: item.year,
    }
  }

  if (item.type === 'show') {
    return {
      type: 'show',
      episodes: item.leafCount,
      id: item.ratingKey,
      seasons: item.childCount,
      summary: item.summary,
      thumbnail,
      title: item.title,
      year: item.year,
    }
  }

  if (item.type === 'track') {
    return {
      type: 'track',
      albumId: item.parentRatingKey,
      albumTitle: item.parentTitle || '',
      artistId: item.grandparentRatingKey,
      artistTitle: item.grandparentTitle,
      duration: item.duration / 1000,
      id: item.ratingKey,
      thumbnail,
      title: item.title,
      paths: item.Media.flatMap((media) => (
        media.Part.map((part) => paths.reduce((v, p) => v.replace(p, ''), part.file))
      )),
    }
  }

  if (item.type === 'collection') {
    return {
      type: 'collection',
      collectionType: item.subtype,
      id: item.ratingKey,
      itemCount: item.childCount,
      summary: item.summary,
      thumbnail,
      title: item.title,
    }
  }

  throw new Error(`Item type ${(item as { type: string }).type} not implemented`)
}

const mapSearchItem = (
  library: plex.Library,
  item: NonNullable<plex.SearchResults['Hub'][0]['Metadata']>[0],
): SearchResultItem => {
  const score = parseFloat(item.score)
  if (item.type === 'tag') {
    if (item.tagType === 1) {
      return {
        type: 'genre',
        id: item.id.toString(),
        title: item.tag,
        score,
      }
    }

    if (item.tagType === 4) {
      return {
        type: 'director',
        id: item.id.toString(),
        title: item.tag,
        thumbnailUrl: item.thumb,
        thumbnail: null,
        score,
      }
    }

    if (item.tagType === 6) {
      return {
        type: 'actor',
        id: item.id.toString(),
        title: item.tag,
        thumbnailUrl: item.thumb,
        thumbnail: null,
        score,
      }
    }

    throw new Error(`Tag type ${(item as { tagType: string }).tagType} not implemented`)
  }

  return {
    ...mapItem(library, item),
    score,
  }
}

const mapTag = ({ id, tag }: { id: string | number, tag: string }) => ({ id, tag })

const mapRating = (rating: { image: string, value: number }): Rating => {
  if (rating.image.startsWith('imdb')) {
    return { source: 'imdb', value: rating.value / 10 }
  }

  if (rating.image.startsWith('rottentomatoes')) {
    return { source: 'rottentomatoes', value: rating.value / 10 }
  }

  if (rating.image.startsWith('themoviedb')) {
    return { source: 'tmdb', value: rating.value / 10 }
  }

  return { source: 'other', value: rating.value / 10 }
}

const mapMetadata = (library: plex.Library, metadata: plex.Metadata): ItemMetadata => {
  const paths = library.Location.map((l) => l.path)
  const thumbnail = extractImageReference(metadata.thumb)

  if (metadata.type === 'album') {
    return {
      type: 'album',
      artistId: metadata.parentRatingKey,
      artistTitle: metadata.parentTitle,
      genres: (metadata.Genre || []).map(mapTag),
      id: metadata.ratingKey,
      mood: (metadata.Mood || []).map(mapTag),
      paths: [],
      rating: metadata.rating,
      references: (metadata.Guid || []).map(({ id }) => id),
      styles: (metadata.Style || []).map(mapTag),
      summary: metadata.summary,
      thumbnail,
      title: metadata.title,
      tracks: metadata.leafCount,
      year: metadata.year,
    }
  }

  if (metadata.type === 'artist') {
    return {
      type: 'artist',
      countries: (metadata.Country || []).map(mapTag),
      genres: (metadata.Genre || []).map(mapTag),
      id: metadata.ratingKey,
      mood: (metadata.Mood || []).map(mapTag),
      paths: metadata.Location.flatMap((location) => (
        paths.reduce((v, p) => v.replace(p, ''), location.path)
      )),
      references: (metadata.Guid || []).map(({ id }) => id),
      styles: (metadata.Style || []).map(mapTag),
      summary: metadata.summary,
      thumbnail,
      title: metadata.title,
    }
  }

  if (metadata.type === 'movie') {
    return {
      type: 'movie',
      contentRating: metadata.contentRating,
      countries: metadata.Country?.map(mapTag) ?? [],
      directors: metadata.Director?.map(mapTag) ?? [],
      duration: metadata.duration / 1000,
      genres: metadata.Genre?.map(mapTag) ?? [],
      id: metadata.ratingKey,
      originalTitle: metadata.originalTitle,
      paths: metadata.Media.flatMap((media) => (
        media.Part.map((part) => paths.reduce((v, p) => v.replace(p, ''), part.file))
      )),
      producers: metadata.Producer?.map(mapTag) ?? [],
      ratings: metadata.Rating?.map(mapRating) ?? [],
      references: metadata.Guid?.map(({ id }) => id) ?? [],
      roles: metadata.Role?.map((role) => ({
        id: role.id,
        role: role.role,
        tag: role.tag,
        thumbnailUrl: role.thumb,
      })) ?? [],
      summary: metadata.summary,
      studio: metadata.studio,
      tagLine: metadata.tagline,
      thumbnail,
      title: metadata.title,
      writers: metadata.Writer?.map(mapTag) ?? [],
      year: metadata.year,
    }
  }

  if (metadata.type === 'season') {
    return {
      type: 'season',
      episodes: metadata.leafCount,
      id: metadata.ratingKey,
      references: metadata.Guid?.map(({ id }) => id) ?? [],
      serieId: metadata.parentRatingKey,
      serieTitle: metadata.parentTitle,
      studio: metadata.parentStudio,
      thumbnail,
      title: metadata.title,
    }
  }

  if (metadata.type === 'show') {
    return {
      type: 'show',
      contentRating: metadata.contentRating,
      countries: metadata.Country?.map(mapTag) ?? [],
      duration: metadata.duration / 1000,
      episodes: metadata.leafCount,
      genres: metadata.Genre.map(mapTag),
      id: metadata.ratingKey,
      paths: metadata.Location?.map((location) => (
        paths.reduce((v, p) => v.replace(p, ''), location.path)
      )) ?? [],
      ratings: metadata.Rating?.map(mapRating) ?? [],
      references: metadata.Guid?.map(({ id }) => id) ?? [],
      roles: metadata.Role?.map((role) => ({
        id: role.id,
        role: role.role,
        tag: role.tag,
        thumbnailUrl: role.thumb,
      })) ?? [],
      seasons: metadata.childCount,
      studio: metadata.studio,
      summary: metadata.summary,
      tagLine: metadata.tagline,
      thumbnail,
      title: metadata.title,
      year: metadata.year,
    }
  }

  if (metadata.type === 'collection') {
    return {
      type: 'collection',
      contentRating: metadata.contentRating,
      id: metadata.ratingKey,
      itemCount: metadata.childCount,
      subType: metadata.subtype,
      summary: metadata.summary,
      thumbnail,
      title: metadata.title,
    }
  }

  throw new Error(`Item type ${(metadata as { type: string }).type} not implemented`)
}

const plexTypeToAreaType = Object.freeze({
  actor: 'actor',
  artist: 'artist',
  track: 'track',
  show: 'show',
  album: 'album',
  episode: 'episode',
  movie: 'movie',
  director: 'director',
  genre: 'genre',
})
const mapHub = <T extends plex.SearchResults['Hub'][0]>(library: plex.Library, hub: T): SearchResultArea | null => {
  if (!hub.Metadata || hub.size === 0) {
    return null
  }

  if (hub.type in plexTypeToAreaType) {
    const type = plexTypeToAreaType[hub.type as keyof typeof plexTypeToAreaType]
    const libraryId = parseInt(library.key, 10)
    const results = hub.Metadata
      .filter((m) => m.librarySectionID === libraryId)
      .map((m) => mapSearchItem(library, m))
    const maxScore = results
      .map((item) => item.score)
      .reduce((sum, score) => Math.max(sum, score), 0.0)
    return {
      count: results.length,
      maxScore,
      // @ts-expect-error probably because mismatch between type and results
      results,
      type,
    }
  }

  throw new Error(`Hub type ${(hub as { type: string }).type} not implemented`)
}

const sortOptionsToPlexSort = Object.freeze({
  'added-at': 'addedAt' as const,
  'audience-rating': 'audienceRating' as const,
  duration: 'duration' as const,
  'episode-added-at': 'episode.addedAt' as const,
  rating: 'rating' as const,
  resolution: 'mediaHeight' as const,
  title: 'titleSort' as const,
  year: 'year' as const,
} satisfies Record<NonNullable<ItemChildrenOptions['sort']>['by'], string>)

export const sourceType = 'plex'

export const getRecentlyAdded = async (app: App): Promise<Item[]> => {
  const library = await getLibrary(app)
  if (!library) {
    return []
  }

  const content = await plex.getLibraryMedia(library.key, {
    sort: library.type === 'show' ? 'episode.addedAt:desc' : 'addedAt:desc',
    type: library.type === 'artist' ? 'album' : undefined,
  })

  if (content?.viewGroup === library.type) {
    // NOTE: limit the number of results, Plex returns all but here we want just some of the values
    return content.Metadata.slice(0, 20).map((m) => mapItem(library, m))
  }

  // sus
  return []
}

export const getItem = async (app: App, key: string): Promise<ItemMetadata | null> => {
  const library = await getLibrary(app)
  if (!library) {
    return null
  }

  const content = await plex.getMetadata(key)
  if (content?.librarySectionID.toString() !== app.mediaLibrary.plex || !content?.size) {
    return null
  }

  return mapMetadata(library, content.Metadata[0])
}

export const getItemChildren = async (
  app: App,
  key?: string,
  options?: ItemChildrenOptions,
): Promise<Item[]> => {
  const library = await getLibrary(app)
  if (!library) {
    return []
  }

  const sort = options?.sort
    ? `${sortOptionsToPlexSort[options.sort.by]}:${options.sort.order || 'asc'}` as const
    : undefined

  const content = key
    ? await plex.getChildren(key)
    : await plex.getLibraryMedia(library.key, {
      sort: sort ?? (library.type === 'artist' ? undefined : 'titleSort:asc'),
      type: library.type === 'artist' ? 'album' : undefined,
    })
  if (content?.librarySectionID.toString() !== library.key) {
    return []
  }

  return content.Metadata.map((m) => mapItem(library, m))
}

export const getType = async (app: App) => {
  const library = await getLibrary(app)
  if (!library) {
    return null
  }

  if (library.type === 'artist') {
    return 'music'
  }

  if (library.type === 'movie') {
    return 'movies'
  }

  if (library.type === 'show') {
    return 'series'
  }

  return null
}

export const getThumbnail = async (
  _: App,
  key: string,
  thumbnailId: string,
): Promise<ThumbnailStream | null> => {
  const response = await plex.getThumbnailStream(key, thumbnailId)
  return response
}

export const search = async (app: App, query: string, limit = 30): Promise<SearchResults> => {
  const [response, library] = await Promise.all([
    plex.search(query, limit),
    getLibrary(app),
  ])

  if (!library) {
    return { areas: [] }
  }

  return {
    areas: response
      .map((hub) => mapHub(library, hub))
      .filter((area): area is NonNullable<typeof area> => area != null && area.count > 0)
      .sort((area1, area2) => area2.maxScore - area1.maxScore),
  }
}
