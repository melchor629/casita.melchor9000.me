import { apiResource, application } from '@melchor629/orm-nas-auth/schema'
import type { ResourceServer } from 'oidc-provider'
import { makeMapper } from '../base-mapper.ts'

type ApiResourceDto = {
  accessTokenFormat: NonNullable<ResourceServer['accessTokenFormat']>
  accessTokenTTL: number | null
  applicationKey: string
  audience: string
  jwt?: ResourceServer['jwt']
  name: string
  scopes: readonly string[]
}

type ApiResourceRow = Omit<typeof apiResource.$inferSelect, 'applicationId'> & {
  applicationKey: string
}

const apiResourceMapper = makeMapper<{
  table: 'apiResource'
  dto: ApiResourceDto
  row: ApiResourceRow
}>()({
  select: {
    accessTokenFormat: apiResource.accessTokenFormat,
    applicationKey: application.key,
    audience: apiResource.audience,
    key: apiResource.key,
    name: apiResource.name,
    scopes: apiResource.scopes,
    accessTokenTTL: apiResource.accessTokenTTL,
    jwt: apiResource.jwt,
  },

  toDto: (values) => ({
    accessTokenFormat: values.accessTokenFormat,
    applicationKey: values.applicationKey,
    audience: values.audience,
    key: values.key,
    name: values.name,
    scopes: values.scopes as string[],
    accessTokenTTL: values.accessTokenTTL,
    jwt: values.jwt as ResourceServer['jwt'],
  }),

  fromDtoToInsert: (values) => ({
    accessTokenFormat: values.accessTokenFormat,
    accessTokenTTL: values.accessTokenTTL,
    applicationKey: values.applicationKey,
    audience: values.audience,
    jwt: values.jwt,
    key: values.key,
    name: values.name,
    scopes: values.scopes,
  }),

  fromDtoToUpdate: (values) => ({
    accessTokenFormat: values.accessTokenFormat,
    accessTokenTTL: values.accessTokenTTL,
    applicationKey: values.applicationKey,
    audience: values.audience,
    jwt: values.jwt,
    name: values.name,
    scopes: values.scopes,
  }),

  toOidc: (values: ApiResourceDto): ResourceServer => ({
    accessTokenFormat: values.accessTokenFormat,
    accessTokenTTL: values.accessTokenTTL ?? undefined,
    audience: values.audience,
    jwt: values.jwt,
    scope: values.scopes.join(' '),
  }),
})

export default apiResourceMapper
