import { execute, graphql } from './gql.ts'

const deleteUserPermissionMutation = graphql(`
  mutation deleteUserPermission($userPermissionId: Int!) {
    deleteUserPermission(id: $userPermissionId)
  }
`)

const deleteUserPermission = async (userPermissionId: number) => {
  const { data: { deleteUserPermission: deleted } } = await execute(
    deleteUserPermissionMutation,
    { userPermissionId },
  )

  return deleted
}

export default deleteUserPermission
