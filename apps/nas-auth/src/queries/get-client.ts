import type { ClientMetadata } from 'oidc-provider'
import { execute, graphql } from './gql.ts'

const GetClientQuery = graphql(`
  query getClient($id: String!) {
    client(id: $id) {
      clientId
      clientName
      fields
    }
  }
`)

const getClient = async (id: string): Promise<ClientMetadata | null> => {
  const { data: { client: response } } = await execute(
    GetClientQuery,
    { id },
  )

  if (response) {
    const { clientId, clientName } = response
    return {
      ...(response.fields as Omit<ClientMetadata, 'client_id' | 'client_name'>),
      client_id: clientId,
      client_name: clientName,
    }
  }

  return null
}

export default getClient
