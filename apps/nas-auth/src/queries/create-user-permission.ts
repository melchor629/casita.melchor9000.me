import nasAuthDatabase from '@melchor629/orm-nas-auth'
import { userPermission } from '@melchor629/orm-nas-auth/schema'

type CreateUserPermissionInput = {
  delete: boolean
  permissionId: number
  userId: number
  write: boolean
}

const createUserPermission = async (values: CreateUserPermissionInput) => {
  const [newUserPermission] = await nasAuthDatabase
    .insert(userPermission)
    .values(values)
    .returning()

  return newUserPermission
}

export default createUserPermission
