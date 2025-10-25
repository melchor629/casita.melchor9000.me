import type { CreateLoginInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const createLoginMutation = graphql(`
  mutation createLogin($login: CreateLoginInput!) {
    addLogin(data: $login) {
      id
    }
  }
`)

const createLogin = async (login: CreateLoginInput) => {
  const { data: { addLogin: newLogin } } = await execute(
    createLoginMutation,
    { login },
  )

  return newLogin
}

export default createLogin
