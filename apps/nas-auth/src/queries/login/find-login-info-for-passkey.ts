import nasAuthDatabase, { and, eq } from '@melchor629/orm-nas-auth'
import { login, user } from '@melchor629/orm-nas-auth/schema'
import userMapper from '#queries/user/mapper.ts'
import loginMapper from './mapper.ts'

const findLoginInfoForPasskey = async (loginId: string) => {
  const [result] = await nasAuthDatabase
    .select({
      ...loginMapper.select,
      user: userMapper.select,
    })
    .from(login)
    .innerJoin(user, eq(login.userId, user.id))
    .where(and(
      eq(login.type, 'passkey'),
      eq(login.loginId, loginId),
    ))
    .limit(1)

  if (!result) return null

  return {
    ...loginMapper.toDto(result),
    user: userMapper.toDto(result.user),
  }
}

export default findLoginInfoForPasskey
