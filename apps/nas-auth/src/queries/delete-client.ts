import { execute, graphql } from './gql.ts'

const deleteMutationMutation = graphql(`
  mutation deleteClient($clientId: String!) {
    deleteClient(id: $clientId)
  }
`)

const deleteClient = async (clientId: string) => {
  const { data: { deleteClient: deleted } } = await execute(
    deleteMutationMutation,
    { clientId },
  )

  return deleted
}

export default deleteClient
