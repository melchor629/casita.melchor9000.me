import type { GetClientsQuery } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const getClientsQuery = graphql(`
  query getClients {
    clients {
      clientId
      clientName
    }
  }
`)

export type GetClients = GetClientsQuery['clients']

const getClients = async () => {
  const { data: { clients } } = await execute(getClientsQuery)

  return clients
}

export default getClients
