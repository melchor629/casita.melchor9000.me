import { client } from '@melchor629/orm-nas-auth/schema'
import type { ClientMetadata } from 'oidc-provider'
import { makeMapper } from '../base-mapper.ts'

type RemoveIndexer<K> =
  string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K

type RemoveIndex<T> = {
  [K in keyof T as RemoveIndexer<K>]: T[K]
}

type ClientDto = Omit<RemoveIndex<ClientMetadata>, 'client_id' | 'client_name'> & {
  clientId: string
  clientName: string
}

const clientMapper = makeMapper<{
  table: 'client'
  dto: ClientDto
  secondaryKey: { clientId: string }
}>()({
  select: {
    clientId: client.clientId,
    clientName: client.clientName,
    fields: client.fields,
  },

  toDto: ({ clientId, clientName, fields }) => ({
    ...(fields as Omit<ClientMetadata, 'client_id' | 'client_name'>),
    clientId,
    clientName,
  }),

  fromDtoToInsert: ({ clientId, clientName, ...fields }) => ({
    clientId,
    clientName,
    fields,
  }),

  fromDtoToUpdate: ({ clientName, ...fields }) => ({
    clientName,
    fields: Object.keys(fields).length === 0 ? undefined : fields,
  }),

  toClient: ({ clientId, clientName, ...fields }: ClientDto): ClientMetadata => ({
    ...fields,
    client_id: clientId,
    client_name: clientName,
  }),
})

export default clientMapper
