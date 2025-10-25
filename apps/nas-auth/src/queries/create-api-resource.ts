import type { CreateApiResourceInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const createApiResourceMutation = graphql(`
  mutation addApiResource($data: CreateApiResourceInput!) {
    addApiResource(data: $data) {
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

const createApiResource = async (apiResource: CreateApiResourceInput) => {
  const { data: { addApiResource: newApiResource } } = await execute(
    createApiResourceMutation,
    { data: apiResource },
  )

  return newApiResource
}

export default createApiResource
