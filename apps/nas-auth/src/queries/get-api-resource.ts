import nasAuthDatabase from '@melchor629/orm-nas-auth'
import type { ResourceServer } from 'oidc-provider'
import apiResourceMapper from './mappers/api-resource.ts'

const getApiResource = async (key: string): Promise<ResourceServer | null> => {
  const result = await nasAuthDatabase.query.apiResource.findFirst({
    where: { key },
  })

  return result ? apiResourceMapper.fromTable(result) : null
}

export default getApiResource
