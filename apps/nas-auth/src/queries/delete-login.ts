import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { login } from '@melchor629/orm-nas-auth/schema'

const deleteLogin = async (loginId: number) => {
  const result = await nasAuthDatabase
    .delete(login)
    .where(eq(login.id, loginId))

  return (result.rowCount ?? 0) > 0
}

export default deleteLogin
