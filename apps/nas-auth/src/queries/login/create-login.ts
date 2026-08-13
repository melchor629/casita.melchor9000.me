import nasAuthDatabase, { eq, sql } from '@melchor629/orm-nas-auth'
import { login, user } from '@melchor629/orm-nas-auth/schema'
import loginMapper from './mapper.ts'

export type CreateLoginInput = typeof loginMapper.$dto.$insert

const createLogin = async (input: CreateLoginInput) => {
  const { userName, ...values } = loginMapper.fromDtoToInsert(input)

  const userQuery = nasAuthDatabase.$with('user').as(
    nasAuthDatabase
      .select({ id: user.id, name: user.userName })
      .from(user)
      .where(eq(user.userName, userName)),
  )

  const [newLogin] = await nasAuthDatabase
    .with(userQuery)
    .insert(login)
    .values({
      ...values,
      userId: sql`(select id from ${userQuery})`,
    })
    .returning({
      ...loginMapper.select,
      userName: sql<string>`(select id from ${userQuery})`,
    })

  return loginMapper.toDto(newLogin)
}

export default createLogin
