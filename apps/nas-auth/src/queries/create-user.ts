import type { CreateUserInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const CreateUserMutation = graphql(`
  mutation createUser($user: CreateUserInput!) {
    addUser(data: $user) {
      id
      userName
    }
  }
`)

const createUser = async (user: CreateUserInput) => {
  const { data: { addUser: newUser } } = await execute(
    CreateUserMutation,
    { user },
  )

  return newUser
}

export default createUser
