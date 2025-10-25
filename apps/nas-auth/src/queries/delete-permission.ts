import { execute, graphql } from './gql.ts'

const deletePermissionMutation = graphql(`
  mutation deletePermission($permissionId: Int!) {
    deletePermission(id: $permissionId)
  }
`)

const deletePermission = async (permissionId: number) => {
  const { data: { deletePermission: deleted } } = await execute(
    deletePermissionMutation,
    { permissionId },
  )

  return deleted ?? false
}

export default deletePermission
