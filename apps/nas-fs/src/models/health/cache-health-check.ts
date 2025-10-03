import { StringEnum, Type, type Static } from '../type-helpers.ts'
import { HealthCheckSchema } from './health-check.ts'

export const CacheHealthCheckSchema = Type.Interface(
  [HealthCheckSchema],
  {
    type: StringEnum(['redis', 'in-memory']),
    keys: Type.Optional(Type.Number()),
  },
  { title: 'CacheHealthCheck' },
)

export type CacheHealthCheck = Static<typeof CacheHealthCheckSchema>
