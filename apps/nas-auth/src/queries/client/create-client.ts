import nasAuthDatabase from '@melchor629/orm-nas-auth'
import { client } from '@melchor629/orm-nas-auth/schema'
import clientMapper from './mapper.ts'

type CreateClientOptions = typeof clientMapper.$dto.$insert

const createClient = async ({ clientId, clientName, ...fields }: CreateClientOptions) => {
  const [newClient] = await nasAuthDatabase
    .insert(client)
    .values({
      clientId,
      clientName,
      fields,
    })
    .returning(clientMapper.select)

  return clientMapper.toDto(newClient)
}

export default createClient
