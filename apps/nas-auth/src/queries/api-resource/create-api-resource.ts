import nasAuthDatabase, { eq, sql } from '@melchor629/orm-nas-auth'
import { apiResource, application } from '@melchor629/orm-nas-auth/schema'
import apiResourceMapper from './mapper.ts'

export type CreateApiResource = typeof apiResourceMapper.$dto.$insert

const createApiResource = async (values: CreateApiResource) => {
  const appIdQuery = nasAuthDatabase.$with('app').as(
    nasAuthDatabase
      .select({ id: application.id, key: application.key })
      .from(application)
      .where(eq(application.key, values.applicationKey)),
  )

  const [result] = await nasAuthDatabase
    .with(appIdQuery)
    .insert(apiResource)
    .values({
      audience: values.audience,
      applicationId: sql`(select id from ${appIdQuery})`,
      key: values.key,
      name: values.name,
      scopes: values.scopes,
      accessTokenFormat: values.accessTokenFormat,
      accessTokenTTL: values.accessTokenTTL,
      jwt: values.jwt,
    })
    .returning({
      ...apiResourceMapper.select,
      applicationKey: appIdQuery.key,
    })

  return apiResourceMapper.toDto(result)
}

export default createApiResource
