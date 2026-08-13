import nasAuthDatabase, { eq, sql } from '@melchor629/orm-nas-auth'
import { application, permission } from '@melchor629/orm-nas-auth/schema'
import permissionMapper from './mapper.ts'

type CreatePermissionInput = typeof permissionMapper.$dto.$insert

const createPermission = async (values: CreatePermissionInput) => {
  const appKeyQuery = nasAuthDatabase.$with('app_key').as(
    nasAuthDatabase
      .select({ id: application.id, key: application.key })
      .from(application)
      .where(eq(application.key, values.applicationKey)),
  )

  const [newPermission] = await nasAuthDatabase
    .with(appKeyQuery)
    .insert(permission)
    .values({
      ...permissionMapper.fromDtoToInsert(values),
      applicationId: sql`(select id from ${appKeyQuery})`,
    })
    .returning({
      ...permissionMapper.select,
      applicationKey: sql<string>`(select id from ${appKeyQuery})`,
    })

  return newPermission
}

export default createPermission
