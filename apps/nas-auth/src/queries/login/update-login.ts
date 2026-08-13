import nasAuthDatabase, { and, eq, sql } from '@melchor629/orm-nas-auth'
import { login } from '@melchor629/orm-nas-auth/schema'
import loginMapper from './mapper.ts'

type UpdateLoginInput = typeof loginMapper.$dto.$update

const updateLogin = async (type: string, loginId: string, data: UpdateLoginInput) => {
  const [updatedLogin] = await nasAuthDatabase
    .update(login)
    .set(loginMapper.fromDtoToUpdate(data))
    .where(and(eq(login.type, type), eq(login.loginId, loginId)))
    .returning({
      ...loginMapper.select,
      userName: sql<string>`'¿'`,
    })

  return loginMapper.toDto(updatedLogin)
}

export default updateLogin
