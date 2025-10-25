import { execute, graphql } from './gql.ts'

const deleteUserMutation = graphql(`
  mutation deleteUser($userId: Int!) {
    deleteUser(id: $userId)
  }
`)

const deleteUser = async (userId: number) => {
  const { data: { deleteUser: deleted } } = await execute(
    deleteUserMutation,
    { userId },
  )

  return deleted
}

export default deleteUser
