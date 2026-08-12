import nasAuthDatabase from '@melchor629/orm-nas-auth'
import { user } from '@melchor629/orm-nas-auth/schema'

const createUser = async (values: typeof user.$inferInsert) => {
  const [newUser] = await nasAuthDatabase
    .insert(user)
    .values(values)
    .returning()

  return newUser
}

export default createUser
