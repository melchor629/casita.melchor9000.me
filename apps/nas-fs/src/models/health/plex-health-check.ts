import { Type, type Static } from '../type-helpers.ts'
import { HealthCheckSchema } from './health-check.ts'

export const PlexHealthCheckSchema = Type.Interface(
  [HealthCheckSchema],
  {
    version: Type.Optional(Type.String()),
  },
  { title: 'PlexHealthCheck' },
)

export type PlexHealthCheck = Static<typeof PlexHealthCheckSchema>
