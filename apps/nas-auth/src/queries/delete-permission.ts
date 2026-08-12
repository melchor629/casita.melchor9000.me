import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { permission } from '@melchor629/orm-nas-auth/schema'

const deletePermission = async (permissionId: number) => {
  const result = await nasAuthDatabase
    .delete(permission)
    .where(eq(permission.id, permissionId))

  return (result.rowCount ?? 0) > 0
}

export default deletePermission
