import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { user } from '@melchor629/orm-nas-auth/schema'
import type userMapper from './mapper.ts'

const deleteUser = async (key: typeof userMapper.$key) => {
  const result = await nasAuthDatabase
    .delete(user)
    .where(eq(user.userName, key.userName))

  return (result.rowCount ?? 0) > 0
}

export default deleteUser
