import nasAuthDatabase, { and, eq, sql } from '@melchor629/orm-nas-auth'
import { application, userPermission, permission, user } from '@melchor629/orm-nas-auth/schema'

const deleteUserPermission = async (permissionName: string, applicationKey: string, userName: string) => {
  const permissionQuery = nasAuthDatabase.$with('perm').as(
    nasAuthDatabase
      .select({ id: permission.id })
      .from(permission)
      .innerJoin(application, eq(permission.applicationId, application.id))
      .where(and(
        eq(permission.name, permissionName),
        eq(application.key, applicationKey),
      )),
  )
  const userQuery = nasAuthDatabase.$with('user').as(
    nasAuthDatabase
      .select({ id: user.id })
      .from(user)
      .where(eq(user.userName, userName)),
  )
  const result = await nasAuthDatabase
    .with(permissionQuery, userQuery)
    .delete(userPermission)
    .where(and(
      eq(userPermission.permissionId, sql`(select "id" from ${permissionQuery})`),
      eq(userPermission.userId, sql`(select "id" from ${userQuery})`),
    ))

  return (result.rowCount ?? 0) > 0
}

export default deleteUserPermission
