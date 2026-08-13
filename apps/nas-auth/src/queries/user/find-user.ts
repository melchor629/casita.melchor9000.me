import nasAuthDatabase, { eq, or } from '@melchor629/orm-nas-auth'
import { user } from '@melchor629/orm-nas-auth/schema'

type Filters = Partial<Record<'userName' | 'email' | 'displayName', string>>

const findUser = async ({ displayName, email, userName }: Filters) => {
  if (!userName && !email && !displayName) return null

  const [result] = await nasAuthDatabase
    .select()
    .from(user)
    .where(or(
      displayName ? eq(user.displayName, displayName) : undefined,
      email ? eq(user.email, email) : undefined,
      userName ? eq(user.userName, userName) : undefined,
    ))
    .limit(1)

  return result ?? null
}

export default findUser
