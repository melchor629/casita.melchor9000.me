import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { permission } from '@melchor629/orm-nas-auth/schema'

type UpdatePermissionInput = {
  displayName?: string
  name?: string
}

const updatePermission = async (id: number, data: UpdatePermissionInput) => {
  const [updatedPermission] = await nasAuthDatabase
    .update(permission)
    .set({
      displayName: data.displayName,
      name: data.name,
    })
    .where(eq(permission.id, id))
    .returning()

  return updatedPermission
}

export default updatePermission
