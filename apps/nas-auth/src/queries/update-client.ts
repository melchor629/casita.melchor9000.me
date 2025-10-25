import { execute, graphql } from './gql.ts'

const updateClientMutation = graphql(`
  mutation updateClient($id: String!, $data: UpdateClientInput!) {
    updateClient(id: $id, data: $data) {
      clientId
      clientName
      fields
    }
  }
`)

type UpdateClientOptions = { clientName: string } & Record<string, unknown>

const updateClient = async (id: string, { clientName, ...fields }: UpdateClientOptions) => {
  const { data: { updateClient: updatedClient } } = await execute(
    updateClientMutation,
    {
      id,
      data: {
        clientName,
        fields,
      },
    },
  )

  if (updatedClient == null) {
    return null
  }

  return {
    ...(updatedClient.fields as Record<string, unknown>),
    clientId: updatedClient.clientId,
    clientName: updatedClient.clientName,
  }
}

export default updateClient
