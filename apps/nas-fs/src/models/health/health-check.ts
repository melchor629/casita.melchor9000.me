import { StringEnum, Type, type Static } from '../type-helpers.ts'

export const HealthCheckStatusSchema = StringEnum(['healthy', 'degraded', 'unhealthy'])

export type HealthCheckStatus = Static<typeof HealthCheckStatusSchema>

export const HealthCheckSchema = Type.Object({
  status: HealthCheckStatusSchema,
  duration: Type.Number(),
  reason: Type.Optional(Type.String()),
}, {
  title: 'HealthCheck',
})

export type HealthCheck = Static<typeof HealthCheckSchema>
