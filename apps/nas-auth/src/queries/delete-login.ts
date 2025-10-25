import { execute, graphql } from './gql.ts'

const deleteLoginMutation = graphql(`
  mutation deleteLogin($loginId: Int!) {
    deleteLogin(id: $loginId)
  }
`)

const deleteLogin = async (loginId: number) => {
  const { data: { deleteLogin: deleted } } = await execute(
    deleteLoginMutation,
    { loginId },
  )

  return deleted
}

export default deleteLogin
