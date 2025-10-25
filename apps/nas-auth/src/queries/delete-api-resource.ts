import { execute, graphql } from './gql.ts'

const deleteApiResourceMutation = graphql(`
  mutation deleteApiResource($key: String!) {
    deleteApiResource(key: $key)
  }
`)

const deleteApiResource = async (key: string) => {
  const { data: { deleteApiResource: deleted } } = await execute(
    deleteApiResourceMutation,
    { key },
  )

  return deleted
}

export default deleteApiResource
