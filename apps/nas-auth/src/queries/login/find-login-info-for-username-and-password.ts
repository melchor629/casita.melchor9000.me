import nasAuthDatabase, { and, eq, or } from '@melchor629/orm-nas-auth'
import { login, user } from '@melchor629/orm-nas-auth/schema'

const findLoginInfoForUsernameAndPassword = async (userId: string, password: string) => {
  const loginIdPreHash = Buffer.from(`_${password}@${userId}_`, 'utf-8')
  const loginIdHashed = await crypto.subtle.digest('SHA-512', loginIdPreHash)
  const loginId = Buffer.from(loginIdHashed).toString('hex')
  const results = await nasAuthDatabase
    .select({
      userName: user.userName,
    })
    .from(login)
    .innerJoin(user, eq(login.userId, user.id))
    .where(and(
      eq(login.type, 'local'),
      eq(login.loginId, loginId),
      or(
        eq(user.userName, userId),
        eq(user.email, userId),
      ),
    ))
    .limit(1)
  return results.at(0)
}

export default findLoginInfoForUsernameAndPassword
