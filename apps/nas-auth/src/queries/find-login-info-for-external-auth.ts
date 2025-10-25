import { execute, graphql } from './gql.ts'

const FindLoginInfoForExternalAuthQuery = graphql(`
  query findLoginInfoForExternalAuth(
    $provider: String!,
    $loginId: String!,
    $displayName: String!,
    $emails: [String!]!,
    $userName: String!,
  ) {
    findLogin(provider: $provider, loginId: $loginId) {
      id
      disabled
      user {
        id
        userName
      }
    }

    user(displayName: $displayName, emails: $emails, userName: $userName) {
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
`)

const findLoginInfoForExternalAuth = async (provider: string, loginId: string, displayName: string, userName: string, email: string) => {
  const { data: { findLogin: login, user } } = await execute(
    FindLoginInfoForExternalAuthQuery,
    {
      provider,
      loginId,
      displayName,
      userName,
      emails: email ? [email] : [],
    },
  )

  return { login, user }
}

export default findLoginInfoForExternalAuth
