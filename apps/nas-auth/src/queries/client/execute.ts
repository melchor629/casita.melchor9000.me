import { GraphQLClient } from 'graphql-request'
import { nasPersistenceApiKey, nasPersistenceUrl } from '../../config.ts'
import type { TypedDocumentString } from './graphql.ts'

const url = new URL('/nas-auth', nasPersistenceUrl).toString()
const client = new GraphQLClient(url, {
  headers: {
    'X-ApiKey': nasPersistenceApiKey ?? '',
  },
  requestMiddleware: async (request) => {
    const otelApi = await import('@opentelemetry/api')
    const context = otelApi.context.active()
    const otelHeaders: Record<string, string> = {}
    otelApi.propagation.inject(context, otelHeaders)
    const newHeaders = new Headers(request.headers)
    for (const [key, value] of Object.entries(otelHeaders)) {
      newHeaders.append(key, value)
    }
    return {
      ...request,
      headers: newHeaders,
    }
  },
})

export default async function execute<TResult, TVariables extends Record<string, unknown>>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const response = await client.rawRequest<TResult>({
    query: query.toString(),
    variables,
  })
  return response
}
