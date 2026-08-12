import type { ClientMetadata } from 'oidc-provider'
import { makeMapper } from './base.ts'

const clientMapper = makeMapper<'client', { clientId: string, clientName: string } & Omit<ClientMetadata, 'client_id' | 'client_name'>>()({
  toClient: ({ clientId, clientName, fields }: Omit<(typeof clientMapper)['$select'], 'id'>): ClientMetadata => ({
    ...(fields as Omit<ClientMetadata, 'client_id' | 'client_name'>),
    client_id: clientId,
    client_name: clientName,
  }),
  fromTable: ({ clientId, clientName, fields }) => ({
    ...(fields as Omit<ClientMetadata, 'client_id' | 'client_name'>),
    clientId,
    clientName,
  }),
})

export default clientMapper
