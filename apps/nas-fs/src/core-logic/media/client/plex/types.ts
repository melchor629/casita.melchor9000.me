export type PlexResult<T> = { MediaContainer: T }

export interface Libraries {
  Directory: Library[]
}

export interface Library {
  key: string
  type: 'show' | 'movie' | 'artist'
  Location: Array<{ id: number, path: string }>
}

export type LibraryContents = ({
  viewGroup: 'show'
  Metadata: Array<LibraryShowItem | LibraryCollectionItem<'show'>>
} | {
  viewGroup: 'movie'
  Metadata: Array<LibraryMovieItem | LibraryCollectionItem<'movie'>>
} | {
  viewGroup: 'artist'
  Metadata: Array<LibraryArtistItem | LibraryAlbumItem>
} | {
  viewGroup: 'season'
  Metadata: LibrarySeasonItem[]
} | {
  viewGroup: 'album'
  Metadata: LibraryAlbumItem[]
} | {
  viewGroup: 'track'
  Metadata: LibraryTrackItem[]
} | {
  viewGroup: 'episode'
  Metadata: LibraryEpisodeItem[]
}) & {
  size: number
  librarySectionID: string | number
}

export interface LibraryMovieItem {
  type: 'movie'
  ratingKey: string
  title: string
  summary: string
  rating: number
  audienceRating: number
  contentRating?: string
  year: number
  tagline?: string
  thumb?: string
  art: string
  duration: number
  Media: Media[]
  Genre: Array<{ tag: string }>
  Director: Array<{ tag: string }>
  Writer: Array<{ tag: string }>
  Country: Array<{ tag: string }>
  Role: Array<{ tag: string }>
}

export interface LibraryShowItem {
  type: 'show'
  ratingKey: string
  title: string
  summary: string
  rating: number
  audienceRating: number
  contentRating?: string
  year: number
  tagline?: string
  thumb?: string
  art: string
  duration: number
  leafCount: number // <- number of chapters
  childCount: number // <- number of seasons
  Genre: Array<{ tag: string }>
  Country: Array<{ tag: string }>
  Role: Array<{ tag: string }>
}

export interface LibraryCollectionItem<SubType extends 'movie' | 'show'> {
  type: 'collection'
  ratingKey: string
  subtype: SubType
  title: string
  summary: string
  thumb?: string
  art: string
  childCount: number
  minYear: string // it is a number
  maxYear: string // it is a number
}

export interface LibraryArtistItem {
  type: 'artist'
  ratingKey: string
  title: string
  summary: string
  thumb?: string
  art?: string
  Country: Array<{ tag: string }>
}

export interface LibraryAlbumItem {
  type: 'album'
  ratingKey: string
  parentRatingKey: string // <- artist
  parentTitle: string
  title: string
  year: number
  thumb?: string
}

export interface LibrarySeasonItem {
  type: 'season'
  ratingKey: string
  key: string
  parentRatingKey: string
  guid: string
  parentGuid: string
  parentStudio: string
  title: string
  titleSort: string
  parentKey: string
  parentTitle: string
  summary: string
  index: number
  parentIndex: number
  year: number
  thumb?: string
  art: string
  parentThumb: string
  parentTheme: string
  leafCount: number
  viewedLeafCount: number
  addedAt: number
  updatedAt: number
}

export interface LibraryTrackItem {
  type: 'track'
  ratingKey: string
  key: string
  parentRatingKey: string
  grandparentRatingKey: string
  guid: string
  parentGuid: string
  grandparentGuid: string
  parentStudio: string
  title: string
  grandparentKey: string
  parentKey: string
  grandparentTitle: string
  parentTitle?: string
  summary: string
  index: number
  parentIndex: number
  ratingCount: number
  parentYear: number
  thumb?: string
  parentThumb: string
  grandparentThumb: string
  duration: number
  addedAt: number
  updatedAt: number
  Media: Media[]
}

export interface LibraryEpisodeItem {
  type: 'episode'
  ratingKey: string
  key: string
  parentRatingKey: string
  grandparentRatingKey: string
  guid: string
  parentGuid: string
  grandparentGuid: string
  title: string
  titleSort: string
  grandparentKey: string
  parentKey: string
  grandparentTitle: string
  parentTitle: string
  originalTitle?: string
  contentRating?: string
  summary: string
  index: number
  parentIndex: number
  audienceRating: number
  parentYear: number
  thumb?: string
  art: string
  parentThumb: string
  grandparentThumb: string
  grandparentArt: string
  grandparentTheme: string
  duration: number
  originallyAvailableAt: string // Date
  addedAt: number
  updatedAt: number
  audienceRatingImage: string
  chapterSource: string
  Media: Media[]
  Director: Tag[]
  Writer: Tag[]
}

interface Media {
  id: number
  duration: number
  bitrate: number
  width?: number
  height?: number
  aspectRatio?: number
  audioChannels: number
  audioCodec: string
  videoCodec?: string
  videoResolution?: string
  container: string
  videoFrameRate?: string
  videoProfile?: string
  Part: Array<{
    id: number
    key: string
    duration: number
    file: string
    size: number
    container: string
    videoProfile: string
    Stream?: Stream[]
  }>
}

interface Stream {
  id: number
  streamType: number
  default?: boolean
  codec: string
  index: number
  bitrate?: number
  bitDepth?: number
  chromaLocation?: string
  chromaSubsampling?: string
  codedHeight?: number
  codedWidth?: number
  colorPrimaries?: string
  colorRange?: string
  colorSpace?: string
  colorTrc?: string
  frameRate?: number
  height?: number
  level?: number
  profile?: string
  refFrames?: number
  width?: number
  displayTitle: string
  extendedDisplayTitle: string
  selected?: boolean
  channels?: number
  language?: string
  languageTag?: string
  languageCode?: string
  audioChannelLayout?: string
  samplingRate?: number
  title?: string
  forced?: boolean
}

/**
 * Notes from Plex:
 * - Movies has following entries:
 *   - "titleSort"
 *   - "year"
 *   - "originallyAvailableAt:desc"
 *   - "rating:desc"
 *   - "audienceRating:desc"
 *   - "userRating:desc"
 *   - "contentRating?:desc"
 *   - "duration:desc"
 *   - "viewOffset:desc"
 *   - "viewCount:desc"
 *   - "addedAt:desc"
 *   - "lastViewedAt:desc"
 *   - "mediaHeight"
 *   - "mediaBitrate:desc"
 *   - "random:desc"
 * - Series has the following:
 *   - "titleSort:desc"
 *   - "year:desc"
 *   - "originallyAvailableAt:desc"
 *   - "rating:desc"
 *   - "audienceRating:desc"
 *   - "userRating:desc"
 *   - "contentRating?:desc"
 *   - "unviewedLeafCount:desc"
 *   - "episode.addedAt:desc"
 *   - "addedAt:desc"
 *   - "lastViewedAt:desc"
 *   - "random:desc"
 */
type LibrarySortOptions = (
  'addedAt'
  | 'titleSort'
  | 'year'
  | 'rating'
  | 'audienceRating'
  | 'duration'
  | 'mediaHeight'
  | 'episode.addedAt'
)
export interface LibraryContentsRequest {
  sort?: `${LibrarySortOptions}:${'asc' | 'desc'}`
  type?: 'movie' | 'show' | 'season' | 'episode' | 'artist' | 'album' | 'track'
}

export interface MovieMetadata {
  ratingKey: string
  key: string
  guid: string
  studio?: string
  type: 'movie'
  title: string
  titleSort: string
  librarySectionTitle: string
  librarySectionID: number
  librarySectionKey: string
  originalTitle?: string
  contentRating?: string
  summary: string
  rating: number
  audienceRating: number
  year: number
  tagline?: string
  thumb?: string
  art: string
  duration: number
  originallyAvailableAt: string // <- Date
  addedAt: number
  updatedAt: number
  audienceRatingImage: string
  chapterSource: string
  hasPremiumPrimaryExtra: string
  ratingImage: string
  Media: Media[]
  Genre?: Tag[]
  Director?: Tag[]
  Writer: Tag[]
  Producer?: Tag[]
  Country?: Tag[]
  Guid?: { id: string }[]
  Rating?: Rating[]
  Role?: Role[]
  Chapter: Chapter[]
  Review: Review[]
  // Preferences: Preferences
  // Extras: Extras
}

export interface ShowMetadata {
  ratingKey: string
  key: string
  guid: string
  studio?: string
  type: 'show'
  title: string
  librarySectionTitle: string
  librarySectionID: number
  librarySectionKey: string
  originalTitle?: string
  contentRating?: string
  summary: string
  index: number
  audienceRating: number
  year: number
  tagline?: string
  thumb?: string
  art: string
  theme: string
  duration: number
  originallyAvailableAt: string // Date
  leafCount: number
  viewedLeafCount: number
  childCount: number
  addedAt: number
  updatedAt: number
  audienceRatingImage: string
  hasPremiumPrimaryExtra: string
  primaryExtraKey: string
  Genre: Tag[]
  Country: Tag[]
  Guid: { id: string }[]
  Rating: Rating[]
  Role?: Role[]
  Location?: { path: string }[]
}

export interface CollectionMetadata {
  type: 'collection'
  ratingKey: string
  key: string
  guid: string
  title: string
  titleSort: string
  librarySectionTitle: string
  librarySectionID: number
  librarySectionKey: string
  contentRating?: string
  subtype: 'movie' | 'show'
  summary: string
  index: number
  ratingCount: number
  thumb?: string
  art: string
  addedAt: number
  updatedAt: number
  childCount: number
  maxYear: string // it is a number
  minYear: string // it is a number
}

export interface AlbumMetadata {
  ratingKey: string
  key: string
  parentRatingKey: string
  guid: string
  parentGuid: string
  studio?: string
  type: 'album'
  title: string
  parentKey: string
  librarySectionTitle: string
  librarySectionID: number
  librarySectionKey: string
  parentTitle: string
  summary: string
  index: number
  rating: number
  year: number
  thumb?: string
  parentThumb: string
  originallyAvailableAt: string // Date
  leafCount: number
  viewedLeafCount: number
  addedAt: number
  updatedAt: number
  Genre?: Tag[]
  Style?: Tag[]
  Format?: Tag[]
  Guid?: { id: string }[]
  Mood?: Tag[]
  // Extras: Extras
}

export interface ArtistMetadata {
  ratingKey: string
  key: string
  guid: string
  type: 'artist'
  title: string
  librarySectionTitle: string
  librarySectionID: number
  librarySectionKey: string
  summary: string
  index: number
  thumb?: string
  addedAt: number
  updatedAt: number
  Genre?: Tag[]
  Country?: Tag[]
  Style?: Tag[]
  Guid?: { id: string }[]
  Similar?: Tag[]
  Mood?: Tag[]
  Location: { path: string }[]
  // Preferences: Preferences
  // Extras: Extras
}

export interface SeasonMetadata {
  ratingKey: string
  key: string
  parentRatingKey: string
  guid: string
  parentGuid: string
  parentStudio: string
  type: 'season'
  title: string
  titleSort: string
  parentKey: string
  librarySectionTitle: string
  librarySectionID: number
  librarySectionKey: string
  parentTitle: string
  summary: string
  index: number
  parentIndex: number
  year: number
  thumb?: string
  art: string
  parentThumb: string
  parentTheme: string
  leafCount: number
  viewedLeafCount: number
  addedAt: number
  updatedAt: number
  Guid: { id: string }[]
}

export type Metadata = (
  MovieMetadata
  | ShowMetadata
  | CollectionMetadata
  | AlbumMetadata
  | ArtistMetadata
  | SeasonMetadata
)

export interface MetadataResponse {
  size: number
  librarySectionID: number
  Metadata: Metadata[]
}

interface Tag {
  id: number
  filter: string
  tag: string
}

interface Rating {
  image: string
  value: number
  type: string
}

interface Role {
  id: number
  filter: string
  tag: string
  tagKey: string
  role: string
  thumb?: string
}

interface Chapter {
  id: number
  filter: string
  index: number
  startTimeOffset: number
  endTimeOffset: number
}

interface Review {
  id: number
  filter: string
  tag: string
  text: string
  image: string
  link: string
  source: string
}

export interface SearchResults {
  size: number
  Hub: SearchResultsHub[]
}

interface SearchResultsHub {
  title: string
  type: 'artist' | 'track' | 'show' | 'album' | 'episode' | 'movie' | 'collection' | 'photoalbum'
  | 'autotag' | 'photo' | 'tag' | 'actor' | 'director' | 'genre' | 'playlist' | 'shared' | 'place'
  hubIdentifier: SearchResultsHub['type']
  context: string
  size: number
  more: boolean
  style: 'shelf'
  Metadata?: SearchResultMetadata[]
}

interface SearchResultArtistItem extends LibraryArtistItem {
  childCount: number
  Genre: { tag: string }[]
}

type SearchResultTrackItem = LibraryTrackItem

interface SearchResultShowItem extends LibraryShowItem {
  Location: { path: string }[]
}

interface SearchResultAlbumItem extends LibraryAlbumItem {
  Genre: { tag: string }[]
}

type SearchResultEpisodeItem = LibraryEpisodeItem

type SearchResultMovieItem = LibraryMovieItem

interface SearchResultActorItem {
  type: 'tag'
  id: number
  tag: string
  thumb?: string
  tagType: 6
}

interface SearchResultDirectorItem {
  type: 'tag'
  id: number
  tag: string
  thumb?: string
  tagType: 4
}

interface SearchResultGenreItem {
  type: 'tag'
  id: number
  tag: string
  tagType: 1
}

type SearchResultMetadata = (
  SearchResultArtistItem
  | SearchResultTrackItem
  | SearchResultShowItem
  | SearchResultAlbumItem
  | SearchResultEpisodeItem
  | SearchResultMovieItem
  | SearchResultActorItem
  | SearchResultDirectorItem
  | SearchResultGenreItem
) & {
  librarySectionID: number
  score: string // its a float
  reason?: 'artist' | 'section' | 'director' | 'actor'
  reasonId?: number
}

export interface Identity {
  claimed: boolean
  machineIentifier: string
  size: number
  version: string
}
