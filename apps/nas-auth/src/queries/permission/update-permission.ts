import nasAuthDatabase, { and, eq } from '@melchor629/orm-nas-auth'
import { application, permission } from '@melchor629/orm-nas-auth/schema'
import permissionMapper from './mapper.ts'

type UpdatePermissionInput = typeof permissionMapper.$dto.$update

const updatePermission = async (appKey: string, name: string, data: UpdatePermissionInput) => {
  const appQuery = nasAuthDatabase.$with('app').as(
    nasAuthDatabase
      .select({ id: application.id, key: application.key })
      .from(application)
      .where(eq(application.key, appKey)),
  )

  const [updatedPermission] = await nasAuthDatabase
    .with(appQuery)
    .update(permission)
    .set(permissionMapper.fromDtoToUpdate(data))
    .from(appQuery)
    .where(and(
      eq(permission.name, name),
      eq(permission.applicationId, appQuery.id),
    ))
    .returning({
      ...permissionMapper.select,
      applicationKey: appQuery.key,
    })

  return permissionMapper.toDto(updatedPermission)
}

export default updatePermission
