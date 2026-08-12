import nasAuthDatabase, { asc, eq } from '@melchor629/orm-nas-auth'
import { application, permission } from '@melchor629/orm-nas-auth/schema'

export type GetPermissions = Array<{
  id: number
  name: string
  displayName?: string | null | undefined
  application: {
    key: string;
    name: string;
  }
}>

const getPermissions = async (): Promise<GetPermissions> => {
  const results = await nasAuthDatabase
    .select({
      id: permission.id,
      name: permission.name,
      displayName: permission.displayName,
      application: {
        key: application.key,
        name: application.name,
      },
    })
    .from(permission)
    .innerJoin(application, eq(permission.applicationId, application.id))
    .orderBy(asc(application.key), asc(permission.name))

  return results
}

export default getPermissions
