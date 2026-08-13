import nasAuthDatabase, { asc, eq } from '@melchor629/orm-nas-auth'
import { application, login, permission, user, userPermission } from '@melchor629/orm-nas-auth/schema'
import loginMapper from '#queries/login/mapper.ts'
import userPermissionMapper from '#queries/user-permission/mapper.ts'
import userMapper from './mapper.ts'

type GetUserRelationKeys = 'logins' | 'permissions'
type GetUserRelations = Partial<Record<GetUserRelationKeys, boolean>>

type ApplyRelation<Value, Condition extends boolean | undefined> =
  Condition extends true
    ? Value
    : Condition extends boolean
      ? Value | undefined
      : never

export type GetUserQuery<Relations extends GetUserRelations = Record<GetUserRelationKeys, true>> = (typeof userMapper.$dto.$select) & {
  logins: ApplyRelation<Array<typeof loginMapper.$dto.$select>, Relations['logins']>
  permissions: ApplyRelation<Array<typeof userPermissionMapper.$dto.$select>, Relations['permissions']>
}

const getUser = async <TRel extends GetUserRelations>(
  { userName }: { userName: string },
  { logins, permissions }: TRel,
): Promise<GetUserQuery<TRel> | null> => {
  const [userResult] = await nasAuthDatabase
    .select({ id: user.id, ...userMapper.select })
    .from(user)
    .where(eq(user.userName, userName))
    .limit(1)

  if (!userResult) return null

  const userDto = userMapper.toDto(userResult) as GetUserQuery<TRel>
  if (logins) {
    const loginResults = await nasAuthDatabase
      .select(loginMapper.select)
      .from(login)
      .innerJoin(user, eq(login.userId, user.id))
      .where(eq(login.userId, userResult.id))
      .orderBy(asc(login.type), asc(login.loginId))
    userDto.logins = loginResults.map(loginMapper.toDto) as GetUserQuery<TRel>['logins']
  }

  if (permissions) {
    const permissionResults = await nasAuthDatabase
      .select(userPermissionMapper.select)
      .from(userPermission)
      .innerJoin(permission, eq(userPermission.permissionId, permission.id))
      .innerJoin(application, eq(permission.applicationId, application.id))
      .innerJoin(user, eq(userPermission.userId, user.id))
      .where(eq(userPermission.userId, userResult.id))
      .orderBy(asc(application.name), asc(permission.name))
    userDto.permissions = permissionResults.map(userPermissionMapper.toDto) as GetUserQuery<TRel>['permissions']
  }

  return userDto
}

export default getUser
