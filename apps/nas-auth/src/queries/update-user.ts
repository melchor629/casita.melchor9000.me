import type { UpdateUserInput } from './client/graphql'
import { execute, graphql } from './gql.ts'

const UpdateUserMutation = graphql(`
  mutation updateUser($user: UpdateUserInput!, $userId: Int!) {
    updateUser(data: $user, id: $userId) {
      id
      userName
      displayName
      givenName
      familyName
      email
      profileImageUrl
      disabled
    }
  }
`)

const updateUser = async (userId: number, user: UpdateUserInput) => {
  const { data: { updateUser } } = await execute(
    UpdateUserMutation,
    { user, userId },
  )
  return updateUser
}

export default updateUser
