import nasAuthDatabase from '@melchor629/orm-nas-auth'
import { client } from '@melchor629/orm-nas-auth/schema'
import clientMapper from './mappers/client.ts'

type CreateClientOptions = typeof clientMapper.$dto

const createClient = async ({ clientId, clientName, ...fields }: CreateClientOptions) => {
  const [newClient] = await nasAuthDatabase
    .insert(client)
    .values({
      clientId,
      clientName,
      fields,
    })
    .returning()

  return clientMapper.fromTable(newClient)
}

export default createClient
