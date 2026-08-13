import nasAuthDatabase, { and, eq, sql } from '@melchor629/orm-nas-auth'
import { application, permission, user, userPermission } from '@melchor629/orm-nas-auth/schema'
import userPermissionMapper from './mapper.ts'

type CreateUserPermissionInput = typeof userPermissionMapper.$dto.$insert

const createUserPermission = async (values: CreateUserPermissionInput) => {
  const {
    applicationKey,
    permissionName,
    userName,
    ...data
  } = userPermissionMapper.fromDtoToInsert(values)

  const permissionQuery = nasAuthDatabase.$with('perm').as(
    nasAuthDatabase
      .select({ id: permission.id, name: permission.name, applicationKey: application.key })
      .from(permission)
      .innerJoin(application, eq(permission.applicationId, application.id))
      .where(and(
        eq(permission.name, permissionName),
        eq(application.key, applicationKey),
      )),
  )
  const userQuery = nasAuthDatabase.$with('user').as(
    nasAuthDatabase
      .select({ id: user.id, name: user.userName })
      .from(user)
      .where(eq(user.userName, userName)),
  )

  const [newUserPermission] = await nasAuthDatabase
    .with(permissionQuery, userQuery)
    .insert(userPermission)
    .values({
      permissionId: sql`(select id from ${permissionQuery})`,
      userId: sql`(select id from ${userQuery})`,
      ...data,
    })
    .returning({
      ...userPermissionMapper.select,
      applicationKey: sql<string>`(select "key" from ${permissionQuery})`,
      permissionName: sql<string>`(select "name" from ${permissionQuery})`,
      userName: sql<string>`(select "userName" from ${userQuery})`,
    })

  return userPermissionMapper.toDto(newUserPermission)
}

export default createUserPermission
