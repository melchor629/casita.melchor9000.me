import type { UpdateLoginInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const updateLoginMutation = graphql(`
  mutation updateLogin($loginId: Int!, $data: UpdateLoginInput!) {
    updateLogin(data: $data, id: $loginId) {
      id
    }
  }
`)

const updateLogin = async (loginId: number, data: UpdateLoginInput) => {
  const { data: { updateLogin: login } } = await execute(
    updateLoginMutation,
    { loginId, data },
  )

  return login
}

export default updateLogin
