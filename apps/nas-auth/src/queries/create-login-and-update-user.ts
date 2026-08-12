import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { login, user } from '@melchor629/orm-nas-auth/schema'

type UpdateUserInput = {
  id: number
} & Partial<typeof user.$inferInsert>

const createLoginAndUpdateUser = async (
  userValues: UpdateUserInput,
  provider: string,
  loginId: string,
  data: Record<string, unknown>,
) => {
  await nasAuthDatabase
    .update(user)
    .set(userValues)
    .where(eq(user.id, userValues.id))

  const [{ loginid }] = await nasAuthDatabase
    .insert(login)
    .values({
      data,
      loginId,
      type: provider,
      userId: userValues.id,
    })
    .returning({ loginid: login.id })

  return { loginId: loginid, userId: userValues.id }
}

export default createLoginAndUpdateUser
