import { execute, graphql } from './gql.ts'

const UpdateLoginDataMutation = graphql(`
  mutation updateLoginData($data: String!, $loginId: Int!) {
    updateLogin(data: { data: $data }, id: $loginId) {
      id
    }
  }
`)

const updateLoginData = async (loginId: number, data: Record<string, unknown>) => {
  await execute(
    UpdateLoginDataMutation,
    { loginId, data: JSON.stringify(data) },
  )
}

export default updateLoginData
