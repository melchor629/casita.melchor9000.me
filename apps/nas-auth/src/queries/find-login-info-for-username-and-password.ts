import { execute, graphql } from './gql.ts'

const FindLoginInfoForUsernameAndPassword = graphql(`
  query findLoginInfoForUsernameAndPassword($loginId: String!, $userId: ID!) {
    findLogin(provider: "local", loginId: $loginId, userId: $userId) {
      id
      user {
        userName
      }
    }
  }
`)

const findLoginInfoForUsernameAndPassword = async (userId: string, password: string) => {
  const loginIdPreHash = Buffer.from(`_${password}@${userId}_`, 'utf-8')
  const loginIdHashed = await crypto.subtle.digest('SHA-512', loginIdPreHash)
  const loginId = Buffer.from(loginIdHashed).toString('hex')
  const { data: { findLogin: login } } = await execute(
    FindLoginInfoForUsernameAndPassword,
    { loginId, userId },
  )

  return login
}

export default findLoginInfoForUsernameAndPassword
