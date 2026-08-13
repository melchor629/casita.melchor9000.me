import nasAuthDatabase, { asc } from '@melchor629/orm-nas-auth'
import { user } from '@melchor629/orm-nas-auth/schema'
import userMapper from './mapper.ts'

export type GetUsers = Array<typeof userMapper.$dto.$select>

const getUsers = async (): Promise<GetUsers> => {
  const results = await nasAuthDatabase
    .select(userMapper.select)
    .from(user)
    .orderBy(asc(user.userName))

  return results.map(userMapper.toDto)
}

export default getUsers
