import nasAuthDatabase, { eq, sql } from '@melchor629/orm-nas-auth'
import { apiResource, application } from '@melchor629/orm-nas-auth/schema'
import type { ResourceServer } from 'oidc-provider'
import apiResourceMapper from './mappers/api-resource.ts'

export type CreateApiResource = {
  accessTokenFormat: NonNullable<ResourceServer['accessTokenFormat']>
  accessTokenTTL?: number | null | undefined
  applicationKey: string
  audience: string
  jwt?: ResourceServer['jwt']
  key: string
  name: string
  scopes: string[]
}

const createApiResource = async (values: CreateApiResource) => {
  const appIdQuery = nasAuthDatabase.$with('app').as(
    nasAuthDatabase
      .select({ id: application.id })
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
    .returning()

  return apiResourceMapper.fromTable(result)
}

export default createApiResource
