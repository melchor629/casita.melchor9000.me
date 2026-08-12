import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { apiResource } from '@melchor629/orm-nas-auth/schema'
import type { ResourceServer } from 'oidc-provider'

export type UpdateApiResource = {
  accessTokenFormat?: NonNullable<ResourceServer['accessTokenFormat']>
  accessTokenTTL?: number
  audience?: string
  jwt?: ResourceServer['jwt']
  name?: string
  scopes?: readonly string[]
}

const updateApiResource = async (key: string, data: UpdateApiResource) => {
  const [updatedApiResource] = await nasAuthDatabase
    .update(apiResource)
    .set({
      accessTokenFormat: data.accessTokenFormat,
      accessTokenTTL: data.accessTokenTTL,
      audience: data.audience,
      jwt: data.jwt,
      name: data.name,
      scopes: data.scopes,
    })
    .where(eq(apiResource.key, key))
    .returning()

  return updatedApiResource
}

export default updateApiResource
