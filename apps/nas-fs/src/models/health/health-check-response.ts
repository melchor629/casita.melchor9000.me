import { Type, type Static } from '../type-helpers.ts'
import { AuthHealthCheckSchema } from './auth-health-check.ts'
import { CacheHealthCheckSchema } from './cache-health-check.ts'
import { HealthCheckStatusSchema } from './health-check.ts'
import { PlexHealthCheckSchema } from './plex-health-check.ts'

export const HealthCheckResponseSchema = Type.Object({
  status: HealthCheckStatusSchema,
  duration: Type.Number(),
  services: Type.Optional(Type.Object({
    cache: CacheHealthCheckSchema,
    authApi: AuthHealthCheckSchema,
    plex: PlexHealthCheckSchema,
  })),
}, {
  title: 'HealthCheckResponse',
  description: 'Health check result',
})

export type HealthCheckResponse = Static<typeof HealthCheckResponseSchema>
