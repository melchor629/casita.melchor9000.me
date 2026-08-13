import nasAuthDatabase from '@melchor629/orm-nas-auth'
import apiResourceMapper from '#queries/api-resource/mapper.ts'
import permissionMapper from '#queries/permission/mapper.ts'
import applicationMapper from './mapper.ts'

export type GetApplication = (typeof applicationMapper.$dto.$select) & {
  permissions: Array<typeof permissionMapper.$dto.$select>
  apiResources: Array<typeof apiResourceMapper.$dto.$select>
}

const getApplication = async (key: string): Promise<GetApplication | null> => {
  const result = await nasAuthDatabase.query.application.findFirst({
    where: { key },
    with: {
      apiResources: true,
      permissions: true,
    },
  })

  if (!result) return null
  return {
    ...applicationMapper.toDto(result),
    apiResources: result.apiResources.map((ar) => apiResourceMapper.toDto({ ...ar, applicationKey: key })),
    permissions: result.permissions.map((p) => permissionMapper.toDto({ ...p, applicationKey: key })),
  }
}

export default getApplication
