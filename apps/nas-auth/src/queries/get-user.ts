import type { GetUserByIdQuery, GetUserByUserNameQuery } from './client/graphql'
import { execute, graphql } from './gql.ts'

const getUserByUserNameQuery = graphql(`
  query getUserByUserName($userName: String!) {
    user(userName: $userName) {
      id
      userName
      displayName
      givenName
      familyName
      email
      profileImageUrl
      disabled
      permissions {
        id
        write
        delete
        permission { id, name, application { key } }
      }
      logins { id, type, loginId, data, disabled }
    }
  }
`)

const getUserByIdQuery = graphql(`
  query getUserById($id: Int!) {
    user(id: $id) {
      id
      userName
      displayName
      givenName
      familyName
      email
      profileImageUrl
      disabled
      permissions {
        id
        write
        delete
        permission { id, name, application { key } }
      }
      logins { id, type, loginId, data, disabled }
    }
  }
`)

type User = NonNullable<(GetUserByIdQuery | GetUserByUserNameQuery)['user']>
export type GetUserQuery = Omit<User, 'permissions' | 'logins'> & {
  permissions?: Array<Omit<User['permissions'][0], 'permission'> & { permission?: User['permissions'][0]['permission'] }>
  logins?: User['logins']
}

const getUser = async (
  arg: string | { userName: string } | { id: number },
  { logins, permissions, userPermissions }: { logins?: boolean, permissions?: boolean, userPermissions?: boolean } = {},
) => {
  let response: { data: { user?: GetUserQuery | undefined | null } }
  if (typeof arg === 'string' || 'userName' in arg) {
    response = await execute(
      getUserByUserNameQuery,
      typeof arg === 'string' ? { userName: arg } : arg,
    )
  } else {
    response = await execute(
      getUserByIdQuery,
      arg,
    )
  }

  if (response.data.user == null) {
    return null
  }

  const { data: { user } } = response
  if (!logins) {
    delete user.logins
  }
  if (!userPermissions) {
    delete user.permissions
  } else if (!permissions) {
    user.permissions?.forEach((perm) => delete perm.permission)
  }

  return user
}

export default getUser
