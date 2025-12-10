export type LibraryType = 'movies' | 'series' | 'music' | 'photos'

interface ImageReference {
  /** Item ID (can be the same item or another) */
  itemId: string
  /** ID of the image */
  imageKey: string
}

interface ShowItem {
  type: 'show'
  id: string
  title: string
  summary: string
  thumbnail: ImageReference | null
  year: number
  seasons: number
  episodes: number
}

interface MovieItem {
  type: 'movie'
  id: string
  title: string
  summary: string
  thumbnail: ImageReference | null
  year: number
  // in seconds
  duration: number
}

interface CollectionType {
  type: 'collection'
  collectionType: 'movie' | 'show'
  id: string
  title: string
  summary: string
  thumbnail: ImageReference | null
  itemCount: number
}

interface ArtistItem {
  type: 'artist'
  id: string
  title: string
  thumbnail: ImageReference | null
}

interface AlbumItem {
  type: 'album'
  id: string
  artistId: string
  artistTitle: string
  title: string
  year: number
  thumbnail: ImageReference | null
}

interface TrackItem {
  type: 'track'
  id: string
  albumId: string
  artistId: string
  title: string
  albumTitle: string
  artistTitle: string
  thumbnail: ImageReference | null
  // in seconds
  duration: number
  paths: string[]
}

interface SeasonItem {
  type: 'season'
  id: string
  serieId: string
  title: string
  serieTitle: string
  summary?: string
  year?: number
  thumbnail: ImageReference | null
  episodes: number
}

interface EpisodeItem {
  type: 'episode'
  id: string
  seasonId: string
  serieId: string
  title: string
  seasonTitle: string
  serieTitle: string
  summary: string
  thumbnail: ImageReference | null
  // in seconds
  duration: number
  paths: string[]
}

interface ActorItem {
  type: 'actor'
  id: string
  title: string
  thumbnailUrl?: string
  thumbnail: ImageReference | null
}

interface DirectorItem {
  type: 'director'
  id: string
  title: string
  thumbnailUrl?: string
  thumbnail: ImageReference | null
}

interface GenreItem {
  type: 'genre'
  id: string
  title: string
}

export type Item = (
  ShowItem
  | MovieItem
  | CollectionType
  | ArtistItem
  | AlbumItem
  | TrackItem
  | SeasonItem
  | EpisodeItem
  | ActorItem
  | DirectorItem
  | GenreItem
)

export interface Tag {
  id: number | string
  tag: string
}

export interface Rating {
  source: 'imdb' | 'rottentomatoes' | 'tmdb' | 'other'
  value: number // from 0 to 1
}

export interface Role {
  id: number
  tag: string
  role: string
  thumbnail: ImageReference | null
  thumbnailUrl?: string
}

interface ArtistItemMetadata {
  type: 'artist'
  id: string
  title: string
  summary: string
  thumbnail: ImageReference | null
  genres: Tag[]
  countries: Tag[]
  styles: Tag[]
  references: string[]
  mood: Tag[]
  paths: string[]
}

interface AlbumItemMetadata {
  type: 'album'
  id: string
  artistId: string
  title: string
  artistTitle: string
  summary: string
  year: number
  // 0 to 10
  rating?: number
  thumbnail: ImageReference | null
  tracks: number
  genres: Tag[]
  styles: Tag[]
  references: string[]
  mood: Tag[]
  paths: string[]
}

interface MovieItemMetadata {
  type: 'movie'
  id: string
  title: string
  originalTitle: string
  contentRating: string
  summary: string
  year: number
  tagLine: string
  thumbnail: ImageReference | null
  // in seconds
  duration: number
  paths: string[]
  genres: Tag[]
  directors: Tag[]
  writers: Tag[]
  producers: Tag[]
  countries: Tag[]
  references: string[]
  ratings: Rating[]
  roles: Role[]
  studio: string
}

interface ShowItemMetadata {
  type: 'show'
  id: string
  title: string
  studio: string
  contentRating: string
  summary: string
  year: number
  tagLine: string
  thumbnail: ImageReference | null
  duration: number
  episodes: number
  seasons: number
  genres: Tag[]
  countries: Tag[]
  references: string[]
  ratings: Rating[]
  roles: Role[]
  paths: string[]
}

interface SeasonItemMetadata {
  type: 'season'
  id: string
  serieId: string
  title: string
  serieTitle: string
  studio: string
  thumbnail: ImageReference | null
  episodes: number
  references: string[]
}

interface CollectionMetadata {
  type: 'collection'
  subType: 'movie' | 'show'
  id: string
  title: string
  summary: string
  contentRating: string
  thumbnail: ImageReference | null
  itemCount: number
}

export type ItemMetadata = (
  ArtistItemMetadata
  | AlbumItemMetadata
  | MovieItemMetadata
  | ShowItemMetadata
  | SeasonItemMetadata
  | CollectionMetadata
)

export interface SearchResults {
  areas: SearchResultArea[]
}

export type SearchResultItem<Type extends Item = Item> = Type & { score: number }

export interface SearchResultArea<Type extends Item = Item> {
  type: Type['type']
  maxScore: number
  count: number
  results: SearchResultItem<Type>[]
}
