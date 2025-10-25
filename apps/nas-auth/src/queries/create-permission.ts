import type { CreatePermissionInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const createPermissionMutation = graphql(`
  mutation addPermission($data: CreatePermissionInput!) {
    addPermission(data: $data) {
      id
      name
      displayName
    }
  }
`)

const createPermission = async (permission: CreatePermissionInput) => {
  const { data: { addPermission: newPermission } } = await execute(
    createPermissionMutation,
    { data: permission },
  )

  return newPermission
}

export default createPermission
