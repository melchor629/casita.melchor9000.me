import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { user } from '@melchor629/orm-nas-auth/schema'

const deleteUser = async (userId: number) => {
  const result = await nasAuthDatabase
    .delete(user)
    .where(eq(user.id, userId))

  return (result.rowCount ?? 0) > 0
}

export default deleteUser
