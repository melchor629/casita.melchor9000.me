import type { EditUserPermissionInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const updateUserPermissionMutation = graphql(`
  mutation updateUserPermission($id: Int!, $userPermission: EditUserPermissionInput!) {
    updateUserPermission(id: $id, data: $userPermission) {
      id
      write
      delete
      permission {
        id
        name
        application {
          name
        }
      }
    }
  }
`)

const updateUserPermission = async (id: number, userPermission: EditUserPermissionInput) => {
  const { data: { updateUserPermission: updatedUserPermission } } = await execute(
    updateUserPermissionMutation,
    {
      id,
      userPermission,
    },
  )

  return updatedUserPermission
}

export default updateUserPermission
