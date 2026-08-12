import nasAuthDatabase, { eq, or } from '@melchor629/orm-nas-auth'
import { user as User } from '@melchor629/orm-nas-auth/schema'

const findLoginInfoForExternalAuth = async (provider: string, loginId: string, displayName: string, userName: string, email: string) => {
  const loginQuery = nasAuthDatabase.query.login.findFirst({
    where: {
      type: provider,
      loginId,
    },
    with: {
      user: true,
    },
  })

  const userQuery = nasAuthDatabase
    .select()
    .from(User)
    .where(or(
      displayName ? eq(User.displayName, displayName) : undefined,
      email ? eq(User.email, email) : undefined,
      userName ? eq(User.userName, userName) : undefined,
    ))
    .limit(1)

  const [login, users] = await Promise.all([loginQuery, userQuery])
  return { login, user: users.at(0) || null }
}

export default findLoginInfoForExternalAuth
