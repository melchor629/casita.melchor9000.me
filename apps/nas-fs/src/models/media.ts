import type { App } from './app.ts'
import { Nullable, StringEnum, Type, type Static } from './type-helpers.ts'

export const mediaItemKeyParamSchema = Type.String({
  title: 'mediaItemKey',
  description: 'Key which identifies a media item',
  minLength: 1,
})

export const mediaItemThumbnailKeyParamSchema = Type.String({
  title: 'mediaItemThumbnailKey',
  description: 'Key which identifies a thumbnail from a media item',
  minLength: 1,
})

export interface MediaSourceRepository {
  readonly sourceType: string
  getRecentlyAdded(app: App): Promise<Item[]>
  getItem(app: App, key: string): Promise<ItemMetadata | null>
  getItemChildren(app: App, key?: string, options?: ItemChildrenOptions): Promise<Item[]>
  getType(app: App): Promise<LibraryType | null>
  getThumbnail(app: App, key: string, thumbnailId: string): Promise<ThumbnailStream | null>
  search(app: App, query: string, limit?: number): Promise<SearchResults>
}

export const LibraryTypeSchema = StringEnum([
  'movies', 'series', 'music', 'photos',
])
export type LibraryType = Static<typeof LibraryTypeSchema>

export interface ThumbnailStream {
  cacheControl: string
  contentType: string
  data: Buffer
}

const ImageReferenceSchema = Type.Object({
  itemId: Type.String(),
  imageKey: Type.String(),
})

export type ShowItem = Static<typeof ShowItemSchema>
const ShowItemSchema = Type.Object({
  type: Type.Literal('show'),
  id: Type.String(),
  title: Type.String(),
  summary: Type.String(),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  year: Type.Number(),
  seasons: Type.Number(),
  episodes: Type.Number(),
}, { title: 'ShowItem' })

export type MovieItem = Static<typeof MovieItemSchema>
const MovieItemSchema = Type.Object({
  type: Type.Literal('movie'),
  id: Type.String(),
  title: Type.String(),
  summary: Type.String(),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  year: Type.Number(),
  duration: Type.Number({ description: 'in seconds' }),
}, { title: 'MovieItem' })

export type CollectionType = Static<typeof CollectionTypeSchema>
const CollectionTypeSchema = Type.Object({
  type: Type.Literal('collection'),
  collectionType: Type.Union([Type.Literal('movie'), Type.Literal('show')]),
  id: Type.String(),
  title: Type.String(),
  summary: Type.String(),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  itemCount: Type.Number(),
}, { title: 'CollectionItem' })

export type ArtistItem = Static<typeof ArtistItemSchema>
const ArtistItemSchema = Type.Object({
  type: Type.Literal('artist'),
  id: Type.String(),
  title: Type.String(),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
}, { title: 'ArtistItem' })

export type AlbumItem = Static<typeof AlbumItemSchema>
const AlbumItemSchema = Type.Object({
  type: Type.Literal('album'),
  id: Type.String(),
  artistId: Type.String(),
  artistTitle: Type.String(),
  title: Type.String(),
  year: Type.Optional(Type.Number()),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
}, { title: 'AlbumItem' })

export type TrackItem = Static<typeof TrackItemSchema>
const TrackItemSchema = Type.Object({
  type: Type.Literal('track'),
  id: Type.String(),
  albumId: Type.String(),
  artistId: Type.String(),
  title: Type.String(),
  albumTitle: Type.String(),
  artistTitle: Type.String(),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  duration: Type.Number(),
  paths: Type.Array(Type.String()),
}, { title: 'TrackItem' })

export type SeasonItem = Static<typeof SeasonItemSchema>
const SeasonItemSchema = Type.Object({
  type: Type.Literal('season'),
  id: Type.String(),
  serieId: Type.String(),
  title: Type.String(),
  serieTitle: Type.String(),
  summary: Type.Optional(Type.String()),
  year: Type.Optional(Type.Number()),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  episodes: Type.Number(),
}, { title: 'SeasonItem' })

export type EpisodeItem = Static<typeof EpisodeItemSchema>
const EpisodeItemSchema = Type.Object({
  type: Type.Literal('episode'),
  id: Type.String(),
  seasonId: Type.String(),
  serieId: Type.String(),
  title: Type.String(),
  seasonTitle: Type.String(),
  serieTitle: Type.String(),
  summary: Type.String(),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  duration: Type.Number(),
  paths: Type.Array(Type.String()),
}, { title: 'EpisodeItem' })

export type ActorItem = Static<typeof ActorItemSchema>
const ActorItemSchema = Type.Object({
  type: Type.Literal('actor'),
  id: Type.String(),
  title: Type.String(),
  thumbnailUrl: Type.Optional(Type.String()),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
}, { title: 'ActorItem' })

export type DirectorItem = Static<typeof DirectorItemSchema>
const DirectorItemSchema = Type.Object({
  type: Type.Literal('director'),
  id: Type.String(),
  title: Type.String(),
  thumbnailUrl: Type.Optional(Type.String()),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
}, { title: 'DirectorItem' })

export type GenreItem = Static<typeof GenreItemSchema>
const GenreItemSchema = Type.Object({
  type: Type.Literal('genre'),
  id: Type.String(),
  title: Type.String(),
}, { title: 'GenreItem' })

export const ItemSchema = Type.Union([
  ShowItemSchema,
  MovieItemSchema,
  CollectionTypeSchema,
  ArtistItemSchema,
  AlbumItemSchema,
  TrackItemSchema,
  SeasonItemSchema,
  EpisodeItemSchema,
  ActorItemSchema,
  DirectorItemSchema,
  GenreItemSchema,
], {
  title: 'Item',
  description: 'Represents one media item',
})

export type Item = Static<typeof ItemSchema>

const TagSchema = Type.Object({
  id: Type.Union([Type.Number(), Type.String()]),
  tag: Type.String(),
}, { title: 'Tag' })

export type Rating = Static<typeof RatingSchema>
const RatingSchema = Type.Object({
  source: StringEnum(['imdb', 'rottentomatoes', 'tmdb', 'other']),
  value: Type.Number({ minimum: 0, maximum: 1 }),
}, { title: 'Rating' })

const RoleSchema = Type.Object({
  id: Type.Number(),
  tag: Type.String(),
  role: Type.String(),
  thumbnailKey: Type.Optional(Type.String()),
  thumbnailUrl: Type.Optional(Type.String()),
}, { title: 'Role' })

const ArtistItemMetadataSchema = Type.Object({
  type: Type.Literal('artist'),
  id: Type.String(),
  title: Type.String(),
  summary: Type.String(),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  genres: Type.Array(TagSchema),
  countries: Type.Array(TagSchema),
  styles: Type.Array(TagSchema),
  references: Type.Array(Type.String()),
  mood: Type.Array(TagSchema),
  paths: Type.Array(Type.String()),
}, { title: 'ArtistItemMetadata' })

const AlbumItemMetadataSchema = Type.Object({
  type: Type.Literal('album'),
  id: Type.String(),
  artistId: Type.String(),
  title: Type.String(),
  artistTitle: Type.String(),
  summary: Type.String(),
  year: Type.Optional(Type.Number()),
  rating: Type.Optional(Type.Number()),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  tracks: Type.Number(),
  genres: Type.Array(TagSchema),
  styles: Type.Array(TagSchema),
  references: Type.Array(Type.String()),
  mood: Type.Array(TagSchema),
  paths: Type.Array(Type.String()),
}, { title: 'AlbumItemMetadata' })

const MovieItemMetadataSchema = Type.Object({
  type: Type.Literal('movie'),
  id: Type.String(),
  title: Type.String(),
  originalTitle: Type.Optional(Type.String()),
  contentRating: Type.Optional(Type.String()),
  summary: Type.String(),
  year: Type.Number(),
  tagLine: Type.Optional(Type.String()),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  duration: Type.Number(),
  paths: Type.Array(Type.String()),
  genres: Type.Array(TagSchema),
  directors: Type.Array(TagSchema),
  writers: Type.Array(TagSchema),
  producers: Type.Array(TagSchema),
  countries: Type.Array(TagSchema),
  references: Type.Array(Type.String()),
  ratings: Type.Array(RatingSchema),
  roles: Type.Array(RoleSchema),
  studio: Type.Optional(Type.String()),
}, { title: 'MovieItemMetadata' })

const ShowItemMetadataSchema = Type.Object({
  type: Type.Literal('show'),
  id: Type.String(),
  title: Type.String(),
  studio: Type.Optional(Type.String()),
  contentRating: Type.Optional(Type.String()),
  summary: Type.String(),
  year: Type.Number(),
  tagLine: Type.Optional(Type.String()),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  duration: Type.Number(),
  episodes: Type.Number(),
  seasons: Type.Number(),
  genres: Type.Array(TagSchema),
  countries: Type.Array(TagSchema),
  references: Type.Array(Type.String()),
  ratings: Type.Array(RatingSchema),
  roles: Type.Array(RoleSchema),
  paths: Type.Array(Type.String()),
}, { title: 'ShowItemMetadata' })

const SeasonItemMetadataSchema = Type.Object({
  type: Type.Literal('season'),
  id: Type.String(),
  serieId: Type.String(),
  title: Type.String(),
  serieTitle: Type.String(),
  studio: Type.Optional(Type.String()),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  episodes: Type.Number(),
  references: Type.Array(Type.String()),
}, { title: 'SeasonItemMetadata' })

const CollectionMetadataSchema = Type.Object({
  type: Type.Literal('collection'),
  subType: Type.Union([Type.Literal('movie'), Type.Literal('show')]),
  id: Type.String(),
  title: Type.String(),
  summary: Type.String(),
  contentRating: Type.Optional(Type.String()),
  thumbnail: Type.Union([ImageReferenceSchema, Type.Null()]),
  itemCount: Type.Number(),
}, { title: 'CollectionItemMetadata' })

export type ItemMetadata = Static<typeof ItemMetadataSchema>
export const ItemMetadataSchema = Type.Union([
  ArtistItemMetadataSchema,
  AlbumItemMetadataSchema,
  MovieItemMetadataSchema,
  ShowItemMetadataSchema,
  SeasonItemMetadataSchema,
  CollectionMetadataSchema,
], {
  title: 'ItemMetadata',
  description: 'Represents one media item with all its metadata',
})

export type SearchResultItem = SearchResultArea['results'][0]

const getSearchResultAreaElement = <
  const TProps extends Type.TProperties & { type: Type.TLiteral<string> },
>(a: Type.TObject<TProps>) => Type.Object({
    type: a.properties.type as Type.TLiteral<TProps extends { type: Type.TLiteral<infer T> } ? T : never>,
    maxScore: Type.Number(),
    count: Type.Integer(),
    results: Type.Array(Type.Interface([a], { score: Type.Number() })),
  })
export type SearchResultArea = Static<typeof SearchResultAreaSchema>
const SearchResultAreaSchema = Type.Union([
  getSearchResultAreaElement(ShowItemSchema),
  getSearchResultAreaElement(MovieItemSchema),
  getSearchResultAreaElement(CollectionTypeSchema),
  getSearchResultAreaElement(ArtistItemSchema),
  getSearchResultAreaElement(AlbumItemSchema),
  getSearchResultAreaElement(TrackItemSchema),
  getSearchResultAreaElement(SeasonItemSchema),
  getSearchResultAreaElement(EpisodeItemSchema),
  getSearchResultAreaElement(ActorItemSchema),
  getSearchResultAreaElement(DirectorItemSchema),
  getSearchResultAreaElement(GenreItemSchema),
])

export type SearchResults = Static<typeof SearchResultsSchema>
export const SearchResultsSchema = Type.Object({
  areas: Type.Readonly(Type.Array(SearchResultAreaSchema)),
}, {
  title: 'SearchResults',
  description: 'Library search results',
})

export type ItemChildrenSortOptions = (
  'added-at'
  | 'title'
  | 'year'
  | 'rating'
  | 'audience-rating'
  | 'duration'
  | 'resolution'
  | 'episode-added-at'
)

export type ItemChildrenTypeOptions = never

export type ItemChildrenFilterOptions = never

export interface ItemChildrenOptions {
  sort?: {
    by: ItemChildrenSortOptions,
    order?: 'asc' | 'desc',
  }
  // TODO type + filter options
  type?: ItemChildrenTypeOptions
  filter?: ItemChildrenFilterOptions
}

/// API Responses \\\

export type GetLibraryChildrenResponse = Static<typeof GetLibraryChildrenResponseSchema>
export const GetLibraryChildrenResponseSchema = Type.Object({
  libraryType: Nullable(LibraryTypeSchema),
  items: Type.Array(ItemSchema),
}, {
  title: 'GetLibraryChildrenResponse',
  description: 'Library contents',
})

export type GetRecentlyAddedResponse = Static<typeof GetRecentlyAddedResponseSchema>
export const GetRecentlyAddedResponseSchema = Type.Object({
  libraryType: Nullable(LibraryTypeSchema),
  items: Type.Array(ItemSchema),
}, {
  title: 'GetRecentlyAddedResponse',
  description: 'Library contents added recently',
})

export type GetItemResponse = ItemMetadata
export const GetItemResponseSchema = ItemMetadataSchema

export type GetItemChildrenResponse = Static<typeof GetItemChildrenResponseSchema>
export const GetItemChildrenResponseSchema = Type.Object({
  items: Type.Readonly(Type.Array(ItemSchema)),
}, {
  title: 'GetItemChildrenResponse',
})
