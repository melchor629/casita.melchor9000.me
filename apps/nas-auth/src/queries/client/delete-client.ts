import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { client } from '@melchor629/orm-nas-auth/schema'

const deleteClient = async (clientId: string) => {
  const result = await nasAuthDatabase
    .delete(client)
    .where(eq(client.clientId, clientId))

  return (result.rowCount ?? 0) > 0
}

export default deleteClient
