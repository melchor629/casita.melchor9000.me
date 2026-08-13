import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { user } from '@melchor629/orm-nas-auth/schema'
import userMapper from './mapper.ts'

type UpdateUserInput = typeof userMapper.$dto.$update

const updateUser = async (userName: string, values: UpdateUserInput) => {
  const [updatedUser] = await nasAuthDatabase
    .update(user)
    .set(userMapper.fromDtoToUpdate(values))
    .where(eq(user.userName, userName))
    .returning(userMapper.select)

  return userMapper.toDto(updatedUser)
}

export default updateUser
