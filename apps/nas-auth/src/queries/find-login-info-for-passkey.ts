import { execute, graphql } from './gql.ts'

const FindLoginInfoForPasskeyQuery = graphql(`
  query findLoginInfoForPasskey(
    $loginId: String!,
  ) {
    findLogin(provider: "passkey", loginId: $loginId) {
      id
      disabled
      data
      user {
        id
        userName
        displayName
        givenName
        familyName
        profileImageUrl
        email
        disabled
      }
    }
  }
`)

const findLoginInfoForPasskey = async (loginId: string) => {
  const { data: { findLogin: login } } = await execute(
    FindLoginInfoForPasskeyQuery,
    {
      loginId,
    },
  )

  return login
}

export default findLoginInfoForPasskey
