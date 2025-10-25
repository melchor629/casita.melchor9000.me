import type { CreateApplicationInput } from './client/graphql.ts'
import { execute, graphql } from './gql.ts'

const createApplicationMutation = graphql(`
  mutation addApplication($data: CreateApplicationInput!) {
    addApplication(data: $data) {
      key
      name
    }
  }
`)

const createApplication = async (application: CreateApplicationInput) => {
  const { data: { addApplication: newApplication } } = await execute(
    createApplicationMutation,
    {
      data: {
        key: application.key,
        name: application.name,
      },
    },
  )

  return newApplication
}

export default createApplication
