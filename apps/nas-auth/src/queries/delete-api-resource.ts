import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { apiResource } from '@melchor629/orm-nas-auth/schema'

const deleteApiResource = async (key: string) => {
  const result = await nasAuthDatabase
    .delete(apiResource)
    .where(eq(apiResource.key, key))

  return (result.rowCount ?? 0) > 0
}

export default deleteApiResource
