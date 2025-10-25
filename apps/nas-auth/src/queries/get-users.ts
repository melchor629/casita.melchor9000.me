import type { GetUsersQuery } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const getUsersQuery = graphql(`
  query getUsers {
    users {
      id
      userName
      displayName
      givenName
      familyName
      email
      profileImageUrl
    }
  }
`)

export type GetUsers = GetUsersQuery['users']

const getUsers = async (): Promise<GetUsers> => {
  const { data: { users } } = await execute(getUsersQuery)

  return users
}

export default getUsers
