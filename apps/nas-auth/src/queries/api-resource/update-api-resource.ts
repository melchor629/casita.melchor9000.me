import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { apiResource } from '@melchor629/orm-nas-auth/schema'
import apiResourceMapper from './mapper.ts'

export type UpdateApiResource = typeof apiResourceMapper.$dto.$update

const updateApiResource = async (key: string, data: UpdateApiResource) => {
  const [updatedApiResource] = await nasAuthDatabase
    .update(apiResource)
    .set(apiResourceMapper.fromDtoToUpdate(data))
    .where(eq(apiResource.key, key))
    .returning(apiResourceMapper.select)

  return updatedApiResource
}

export default updateApiResource
