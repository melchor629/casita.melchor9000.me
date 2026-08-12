import type { ResourceServer } from 'oidc-provider'
import { makeMapper } from './base.ts'

const apiResourceMapper = makeMapper<'apiResource', ResourceServer>()({
  fromTable: (values) => ({
    accessTokenFormat: values.accessTokenFormat,
    accessTokenTTL: values.accessTokenTTL ?? undefined,
    audience: values.audience,
    jwt: values.jwt as ResourceServer['jwt'],
    scope: (values.scopes as string[]).join(' '),
  }),
})

export default apiResourceMapper
