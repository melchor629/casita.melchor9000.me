import type { CreateClientInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const createClientMutation = graphql(`
  mutation addClient($data: CreateClientInput!) {
    addClient(data: $data) {
      clientId
      clientName
      fields
    }
  }
`)

type CreateClientOptions = Pick<CreateClientInput, 'clientId' | 'clientName'> & Record<string, unknown>

const createClient = async ({ clientId, clientName, ...fields }: CreateClientOptions) => {
  const { data: { addClient: newClient } } = await execute(
    createClientMutation,
    {
      data: {
        clientId,
        clientName,
        fields,
      },
    },
  )

  return {
    ...(newClient.fields as Record<string, unknown>),
    clientId: newClient.clientId,
    clientName: newClient.clientName,
  }
}

export default createClient
