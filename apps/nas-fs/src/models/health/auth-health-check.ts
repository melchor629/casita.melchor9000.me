import { Type, type Static } from '../type-helpers.ts'
import { HealthCheckSchema } from './health-check.ts'

export const AuthHealthCheckSchema = Type.Interface(
  [HealthCheckSchema],
  {
    statusCode: Type.Optional(Type.Number()),
    body: Type.Optional(Type.String()),
  },
  { title: 'AuthHealthCheck' },
)

export type AuthHealthCheck = Static<typeof AuthHealthCheckSchema>
