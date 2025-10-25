import { execute, graphql } from './gql.ts'

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

const GetPermissionsForUserQuery = graphql(`
  query getPermissionsForUser($userName: String!) {
    user(userName: $userName) {
      permissions {
        write
        delete
        permission {
          name
          displayName
          application {
            key
            name
          }
        }
      }
    }
  }
`)

const getPermissionsForUser = async (userName: string): Promise<PermissionsForUser> => {
  const { data: { user } } = await execute(
    GetPermissionsForUserQuery,
    { userName },
  )

  if (user == null) {
    return { permissions: [], applications: {} }
  }

  return {
    permissions: user.permissions.map((perm) => ({
      name: perm.permission.name,
      displayName: perm.permission.displayName,
      applicationKey: perm.permission.application.key,
      write: perm.write,
      delete: perm.delete,
    })),
    applications: Object.fromEntries(
      user.permissions
        .map((perm) => perm.permission.application)
        .map((app) => [app.key, { key: app.key, name: app.name }] as const),
    ),
  }
}

export default getPermissionsForUser
