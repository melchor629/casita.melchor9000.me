import type { UpdateUserInput } from './client/graphql'
import { execute, graphql } from './gql.ts'

const CreateLoginAndUpdateUserMutation = graphql(`
  mutation createLoginAndUpdateUser(
    $data: JSONObject,
    $loginId: String!,
    $provider: String!,
    $user: UpdateUserInput!,
    $userId: Int!,
  ) {
    addLogin(data: { data: $data, loginId: $loginId, type: $provider, userId: $userId }) {
      id
    }

    updateUser(data: $user, id: $userId) {
      id
    }
  }
`)

const createLoginAndUpdateUser = async (
  user: UpdateUserInput & { id: number },
  provider: string,
  loginId: string,
  data: Record<string, unknown>,
) => {
  const { data: { addLogin, updateUser } } = await execute(
    CreateLoginAndUpdateUserMutation,
    {
      data,
      loginId,
      provider,
      user: {
        displayName: user.displayName,
        email: user.email,
        givenName: user.givenName,
        familyName: user.familyName,
        profileImageUrl: user.profileImageUrl,
      },
      userId: user.id,
    },
  )
  return { loginId: addLogin.id, userId: updateUser.id }
}

export default createLoginAndUpdateUser
