import nasAuthDatabase, { and, eq } from '@melchor629/orm-nas-auth'
import { application, userPermission, permission, user } from '@melchor629/orm-nas-auth/schema'

type EditUserPermissionInput = {
  delete: boolean
  write: boolean
}

const updateUserPermission = async (applicationKey: string, permissionName: string, userName: string, values: EditUserPermissionInput) => {
  const permissionQuery = nasAuthDatabase.$with('perm').as(
    nasAuthDatabase
      .select({ permId: permission.id.as('permId'), userId: user.id.as('userId') })
      .from(permission)
      .innerJoin(application, eq(permission.applicationId, application.id))
      .crossJoin(user)
      .where(and(
        eq(permission.name, permissionName),
        eq(application.key, applicationKey),
        eq(user.userName, userName),
      )),
  )

  await nasAuthDatabase
    .with(permissionQuery)
    .update(userPermission)
    .set({
      delete: values.delete,
      write: values.write,
    })
    .from(permissionQuery)
    .where(and(
      eq(userPermission.permissionId, permissionQuery.permId),
      eq(userPermission.userId, permissionQuery.userId),
    ))
}

export default updateUserPermission
