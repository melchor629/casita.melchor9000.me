import type { UpdateApiResourceInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const updateApiResourceMutation = graphql(`
  mutation updateApiResource($key: String!, $data: UpdateApiResourceInput!) {
    updateApiResource(key: $key, data: $data) {
      accessTokenFormat
      accessTokenTTL
      audience
      jwt
      key
      name
      scopes
    }
  }
`)

const updateApiResource = async (key: string, data: UpdateApiResourceInput) => {
  const { data: { updateApiResource: apiResource } } = await execute(
    updateApiResourceMutation,
    { key, data },
  )

  return apiResource
}

export default updateApiResource
