import nasAuthDatabase, { asc, eq } from '@melchor629/orm-nas-auth'
import { application, permission, user, userPermission } from '@melchor629/orm-nas-auth/schema'

type PermissionsForUserPermission = Readonly<{
  name: string
  displayName?: string | null
  applicationKey: string
  write: boolean
  delete: boolean
}>

type PermissionsForUserApplication = Readonly<{
  key: string
  name: string
}>

export type PermissionsForUser = Readonly<{
  permissions: ReadonlyArray<PermissionsForUserPermission>
  applications: Readonly<Record<string, PermissionsForUserApplication>>
}>

const getPermissionsForUser = async (userName: string): Promise<PermissionsForUser> => {
  const result = await nasAuthDatabase
    .select({
      name: permission.name,
      displayName: permission.displayName,
      applicationKey: application.key,
      applicationName: application.name,
      write: userPermission.write,
      delete: userPermission.delete,
    })
    .from(user)
    .innerJoin(userPermission, eq(user.id, userPermission.userId))
    .innerJoin(permission, eq(permission.id, userPermission.permissionId))
    .innerJoin(application, eq(application.id, permission.applicationId))
    .where(eq(user.userName, userName))
    .orderBy(asc(application.key), asc(permission.name))

  return {
    permissions: result.map((row) => ({
      name: row.name,
      displayName: row.displayName,
      applicationKey: row.applicationKey,
      write: row.write,
      delete: row.delete,
    })),
    applications: Object.fromEntries(
      result
        .map((row) => [row.applicationKey, { key: row.applicationKey, name: row.applicationName }] as const),
    ),
  }
}

export default getPermissionsForUser
