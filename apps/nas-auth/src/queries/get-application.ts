import nasAuthDatabase from '@melchor629/orm-nas-auth'
import type { ResourceServer } from 'oidc-provider'

export type GetApplication = {
  key: string
  name: string
  permissions: Array<{
    id: number
    name: string
    displayName?: string | null | undefined
  }>
  apiResources: Array<Omit<ResourceServer, 'scope'> & {
    scopes: readonly string[]
    key: string
    name: string
  }>
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
    ...result,
    apiResources: result.apiResources.map((ar): GetApplication['apiResources'][0] => ({
      ...ar,
      scopes: ar.scopes as string[],
      accessTokenFormat: ar.accessTokenFormat ?? null,
      accessTokenTTL: ar.accessTokenTTL ?? undefined,
      jwt: ar.jwt as ResourceServer['jwt'],
    })),
  }
}

export default getApplication
