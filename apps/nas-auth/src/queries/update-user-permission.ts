import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { userPermission } from '@melchor629/orm-nas-auth/schema'

type EditUserPermissionInput = {
  delete: boolean
  write: boolean
}

const updateUserPermission = async (id: number, values: EditUserPermissionInput) => {
  await nasAuthDatabase
    .update(userPermission)
    .set({
      delete: values.delete,
      write: values.write,
    })
    .where(eq(userPermission.id, id))
}

export default updateUserPermission
