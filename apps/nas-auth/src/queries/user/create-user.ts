import nasAuthDatabase from '@melchor629/orm-nas-auth'
import { user } from '@melchor629/orm-nas-auth/schema'
import userMapper from './mapper.ts'

const createUser = async (values: typeof userMapper.$dto.$insert) => {
  const [newUser] = await nasAuthDatabase
    .insert(user)
    .values(values)
    .returning(userMapper.select)

  return userMapper.toDto(newUser)
}

export default createUser
