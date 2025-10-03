import { Type, type Static } from '../type-helpers.ts'

export const UrlAliasRequestSchema = Type.Object({
  paths: Type.Array(Type.String(), { minItems: 1, description: 'List of paths to entries to group under the same alias' }),
}, {
  title: 'UrlAliasRequest',
  description: 'Create URL alias request',
})

export type UrlAliasRequest = Static<typeof UrlAliasRequestSchema>

export const UrlAliasResponseSchema = Type.Object({
  id: Type.String({ description: 'ID of the generated alias' }),
  url: Type.String({ description: 'Path to the generated URL alias (points to the first file)' }),
  urls: Type.Record(Type.String(), Type.String(), { description: 'Map that associates each file to the path to the URL alias' }),
}, {
  title: 'UrlAliasResponse',
  description: 'Response for URL alias creation',
})

export type UrlAliasResponse = Static<typeof UrlAliasResponseSchema>
