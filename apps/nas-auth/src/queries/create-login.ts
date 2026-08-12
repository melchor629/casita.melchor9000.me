import nasAuthDatabase from '@melchor629/orm-nas-auth'
import { login } from '@melchor629/orm-nas-auth/schema'

const createLogin = async (values: typeof login.$inferInsert) => {
  const [newLogin] = await nasAuthDatabase
    .insert(login)
    .values(values)
    .returning()

  return newLogin
}

export default createLogin
