import { execute, graphql } from './gql.ts'

const getApiResourcesQuery = graphql(`
  query apiResources {
    apiResources {
      key
      name
      audience
    }
  }
`)

const getApiResources = async () => {
  const { data: { apiResources } } = await execute(getApiResourcesQuery)

  return apiResources
}

export default getApiResources
