import type { CreateUserPermissionInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const createUserPermissionMutation = graphql(`
  mutation createUserPermission($userPermission: CreateUserPermissionInput!) {
    addUserPermission(data: $userPermission) {
      id
      write
      delete
      permission {
        id
        name
        application {
          key
        }
      }
    }
  }
`)

const createUserPermission = async (userPermission: CreateUserPermissionInput) => {
  const { data: { addUserPermission: newUserPermission } } = await execute(
    createUserPermissionMutation,
    {
      userPermission,
    },
  )

  return newUserPermission
}

export default createUserPermission
