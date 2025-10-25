import type { GetPermissionsQuery } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const getPermissionsQuery = graphql(`
  query getPermissions {
    permissions {
      id
      name
      displayName
      application {
        key
        name
      }
    }
  }
`)

export type GetPermissions = GetPermissionsQuery['permissions']

const getPermissions = async (): Promise<GetPermissions> => {
  const { data: { permissions } } = await execute(getPermissionsQuery)

  return permissions
}

export default getPermissions
