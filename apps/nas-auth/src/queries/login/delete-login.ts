import nasAuthDatabase, { and, eq } from '@melchor629/orm-nas-auth'
import { login } from '@melchor629/orm-nas-auth/schema'
import type loginMapper from './mapper.ts'

const deleteLogin = async (type: (typeof loginMapper.$dto.$select)['type'], loginId: string) => {
  const result = await nasAuthDatabase
    .delete(login)
    .where(and(
      eq(login.type, type),
      eq(login.loginId, loginId),
    ))

  return (result.rowCount ?? 0) > 0
}

export default deleteLogin
