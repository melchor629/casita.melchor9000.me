import type { ResourceServer } from 'oidc-provider'
import type { GetApplicationQuery } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const getApplicationQuery = graphql(`
  query getApplication($key: String!) {
    application(key: $key) {
      key
      name
      permissions {
        id
        name
        displayName
      }
      apiResources {
        key
        name
        scopes
        audience
        accessTokenFormat
        accessTokenTTL
        jwt
      }
    }
  }
`)

export type GetApplication = Omit<NonNullable<GetApplicationQuery['application']>, 'apiResources'> & {
  apiResources: Array<Omit<ResourceServer, 'scopes'> & {
    scopes: readonly string[]
    key: string
    name: string
  }>
}

const getApplication = async (key: string) => {
  const { data: { application } } = await execute(
    getApplicationQuery,
    { key },
  )

  return (application as GetApplication | null) ?? null
}

export default getApplication
