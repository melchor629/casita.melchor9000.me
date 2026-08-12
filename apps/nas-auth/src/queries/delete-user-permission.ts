import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { userPermission } from '@melchor629/orm-nas-auth/schema'

const deleteUserPermission = async (userPermissionId: number) => {
  const result = await nasAuthDatabase
    .delete(userPermission)
    .where(eq(userPermission.id, userPermissionId))

  return (result.rowCount ?? 0) > 0
}

export default deleteUserPermission
