import nasAuthDatabase, { asc, eq } from '@melchor629/orm-nas-auth'
import { application, permission } from '@melchor629/orm-nas-auth/schema'
import permissionMapper from './mapper.ts'

export type GetPermissions = Array<typeof permissionMapper.$dto.$select>

const getPermissions = async (): Promise<GetPermissions> => {
  const results = await nasAuthDatabase
    .select(permissionMapper.select)
    .from(permission)
    .innerJoin(application, eq(permission.applicationId, application.id))
    .orderBy(asc(application.key), asc(permission.name))

  return results
}

export default getPermissions
