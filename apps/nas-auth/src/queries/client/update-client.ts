import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { client } from '@melchor629/orm-nas-auth/schema'
import clientMapper from './mapper.ts'

type UpdateClientOptions = typeof clientMapper.$dto.$update

const updateClient = async (id: string, { clientName, ...fields }: UpdateClientOptions) => {
  const [updatedClient] = await nasAuthDatabase
    .update(client)
    .set({
      clientName,
      fields,
    })
    .where(eq(client.clientId, id))
    .returning(clientMapper.select)

  return clientMapper.toDto(updatedClient)
}

export default updateClient
