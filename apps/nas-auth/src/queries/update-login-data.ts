import { execute, graphql } from './gql.ts'

const UpdateLoginDataMutation = graphql(`
  mutation updateLoginData($data: JSONObject!, $loginId: Int!) {
    updateLogin(data: { data: $data }, id: $loginId) {
      id
    }
  }
`)

const updateLoginData = async (loginId: number, data: Record<string, unknown>) => {
  await execute(
    UpdateLoginDataMutation,
    { loginId, data },
  )
}

export default updateLoginData
