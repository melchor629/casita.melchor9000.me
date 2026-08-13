import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { apiResource, application } from '@melchor629/orm-nas-auth/schema'
import apiResourceMapper from './mapper.ts'

const getApiResource = async (key: string) => {
  const [result] = await nasAuthDatabase
    .select(apiResourceMapper.select)
    .from(apiResource)
    .innerJoin(application, eq(apiResource.applicationId, application.id))
    .where(eq(apiResource.key, key))
    .limit(1)

  return result ? apiResourceMapper.toOidc(apiResourceMapper.toDto(result)) : null
}

export default getApiResource
