import type { UpdatePermissionInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const updatePermissionMutation = graphql(`
  mutation updatePermission($id: Int!, $data: UpdatePermissionInput!) {
    updatePermission(id: $id, data: $data) {
      id
      name
      displayName
    }
  }
`)

const updatePermission = async (id: number, data: UpdatePermissionInput) => {
  const { data: { updatePermission: login } } = await execute(
    updatePermissionMutation,
    { id, data },
  )

  return login
}

export default updatePermission
