import type { GetApplicationsQuery } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const getApplicationsQuery = graphql(`
  query getApplications {
    applications {
      key
      name
    }
  }
`)

export type GetApplications = GetApplicationsQuery['applications']

const getApplications = async () => {
  const { data: { applications } } = await execute(getApplicationsQuery)

  return applications
}

export default getApplications
