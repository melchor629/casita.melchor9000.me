import type { ResourceServer } from 'oidc-provider'
import { execute, graphql } from './gql.ts'

const GetApiResourceQuery = graphql(`
  query apiResource($key: String!) {
    apiResource(key: $key) {
      scopes
      audience
      accessTokenFormat
      accessTokenTTL
      jwt
    }
  }
`)

const getApiResource = async (key: string): Promise<ResourceServer | null> => {
  const { data: { apiResource } } = await execute(
    GetApiResourceQuery,
    { key },
  )

  return apiResource
    ? {
        accessTokenFormat: apiResource.accessTokenFormat,
        accessTokenTTL: apiResource.accessTokenTTL ?? undefined,
        audience: apiResource.audience,
        jwt: apiResource.jwt as ResourceServer['jwt'],
        scope: (apiResource.scopes as string[]).join(' '),
      }
    : null
}

export default getApiResource
