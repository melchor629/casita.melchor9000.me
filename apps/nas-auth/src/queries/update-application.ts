import type { UpdateApplicationInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const updateApplicationMutation = graphql(`
  mutation updateApplication($key: String!, $data: UpdateApplicationInput!) {
    updateApplication(key: $key, data: $data) {
      key
      name
    }
  }
`)

const updateApplication = async (key: string, data: UpdateApplicationInput) => {
  const { data: { updateApplication: application } } = await execute(
    updateApplicationMutation,
    { key, data },
  )

  return application
}

export default updateApplication
