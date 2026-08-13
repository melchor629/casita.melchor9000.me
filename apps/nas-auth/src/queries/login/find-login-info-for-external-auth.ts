import nasAuthDatabase, { and, eq } from '@melchor629/orm-nas-auth'
import { login, user } from '@melchor629/orm-nas-auth/schema'
import loginMapper from './mapper.ts'

const findLoginInfoForExternalAuth = async (provider: string, loginId: string) => {
  const [loginResult] = await nasAuthDatabase
    .select(loginMapper.select)
    .from(login)
    .innerJoin(user, eq(login.userId, user.id))
    .where(and(
      eq(login.type, provider),
      eq(login.loginId, loginId),
    ))
    .limit(1)

  return loginResult ? loginMapper.toDto(loginResult) : null
}

export default findLoginInfoForExternalAuth
