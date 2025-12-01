import { plexToken, plexUrl } from '../../../../config.ts'
import type {
  Identity,
  Libraries,
  LibraryContents,
  LibraryContentsRequest,
  MetadataResponse,
  PlexResult,
  SearchResults,
} from './types.ts'

type QueryParams = Record<string, string | number | boolean | undefined>

class PlexException extends Error {
  readonly status?: number
  readonly body?: unknown

  constructor(
    message: string,
    status?: number,
    body?: unknown,
    cause?: unknown,
  ) {
    super(message, { cause })
    this.status = status
    this.body = body
  }
}

const queryParamsToString = (queryParams: QueryParams) => (
  new URLSearchParams(
    Object.fromEntries(
      Object.entries(queryParams)
        .filter(([, value]) => value != null)
        .map(([key, value]) => [key, value!.toString()] as const),
    ),
  ).toString()
)

const request = async (endpoint: string, queryParams: QueryParams = {}) => {
  if (!plexToken) {
    throw new Error('PLEX_TOKEN is empty - fill the variable to call to PMS')
  }

  const headers = {
    'X-Plex-Token': plexToken,
    Accept: 'application/json, text/plain, */*',
  }
  const query = queryParamsToString(queryParams)
  try {
    const response = await fetch(new URL(`${endpoint}?${query}`, plexUrl), {
      headers,
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }

      const isJson = response.headers.get('content-type')?.includes('application/json')
      if (isJson) {
        const body = await response.json()
        throw new PlexException('Call to PMS API failed', response.status, body)
      } else {
        const body = await response.text()
        throw new PlexException('Call to PMS API failed', response.status, body)
      }
    }

    return response
  } catch (e) {
    if (e instanceof PlexException) {
      throw e
    }

    throw new PlexException('Failed calling PMS API', undefined, undefined, e)
  }
}

const requestJson = async <T>(endpoint: string, queryParams: QueryParams = {}) => {
  const response = await request(endpoint, queryParams)

  if (response == null) {
    return null
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  if (isJson) {
    const body = await response.json() as PlexResult<T>
    return body.MediaContainer
  }

  const body = await response.text()
  throw new PlexException('PMS API Response is not json', response.status, body)
}

export const getLibraries = async () => {
  const libraries = await requestJson<Libraries>('/library/sections')
  return libraries
}

const typeToId = Object.freeze({
  movie: 1,
  show: 2,
  season: 3,
  episode: 4,
  artist: 8,
  album: 9,
  track: 10,
})
export const getLibraryMedia = async (libraryId: string, options: LibraryContentsRequest = {}) => {
  const contents = await requestJson<LibraryContents>(`/library/sections/${libraryId}/all`, {
    sort: options.sort,
    type: options.type ? typeToId[options.type] : undefined,
  })
  return contents
}

export const getThumbnailStream = async (contentKey: string, thumbnailKey: string) => {
  const response = await request(`/library/metadata/${contentKey}/thumb/${thumbnailKey}`)
  return response
    ? {
        data: Buffer.from(await response.arrayBuffer()),
        contentType: response.headers.get('content-type')!,
        cacheControl: response.headers.get('cache-control')!,
      }
    : null
}

export const getMetadata = async (contentKey: string) => {
  const response = await requestJson<MetadataResponse>(
    `/library/metadata/${contentKey}`,
    {
      includeConcerts: 1,
      includeExtras: 1,
      // includeOnDeck: 1,
      // includePopularLeaves: 1,
      // includePreferences: 1,
      includeReviews: 1,
      includeChapters: 1,
      includeStations: 1,
      includeExternalMedia: 1,
      asyncAugmentMetadata: 1,
      asyncCheckFiles: 1,
      asyncRefreshAnalysis: 1,
      asyncRefreshLocalMediaAgent: 1,
    },
  )

  return response
}

export const getChildren = async (contentKey: string) => {
  const response = await requestJson<LibraryContents>(
    `/library/metadata/${contentKey}/children`,
    { excludeAllLeaves: 1 },
  )

  return response
}

export const search = async (query: string, limit: number = 30) => {
  const response = await requestJson<SearchResults>('/hubs/search', {
    query,
    limit,
  })

  return response?.Hub ?? []
}

export const identity = async () => {
  const response = await requestJson<Identity>('/identity')

  return response
}
