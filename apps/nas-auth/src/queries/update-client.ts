import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { client } from '@melchor629/orm-nas-auth/schema'
import clientMapper from './mappers/client.ts'

type UpdateClientOptions = { clientName?: string } & Record<string, unknown>

const updateClient = async (id: string, { clientName, ...fields }: UpdateClientOptions) => {
  const [updatedClient] = await nasAuthDatabase
    .update(client)
    .set({
      clientName,
      fields,
    })
    .where(eq(client.clientId, id))
    .returning()

  return clientMapper.fromTable(updatedClient)
}

export default updateClient
