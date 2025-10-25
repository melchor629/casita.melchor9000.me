import { execute, graphql } from './gql.ts'

const deleteApplicationMutation = graphql(`
  mutation deleteApplication($key: String!) {
    deleteApplication(key: $key)
  }
`)

const deleteApplication = async (key: string) => {
  const { data: { deleteApplication: deleted } } = await execute(
    deleteApplicationMutation,
    { key },
  )

  return deleted
}

export default deleteApplication
