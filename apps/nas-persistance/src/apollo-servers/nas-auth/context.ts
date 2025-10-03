import type { OpenTelemetryReqInstance } from '@autotelic/fastify-opentelemetry'
import type { DataSource } from 'typeorm'
import {
  ApplicationRepository,
  PermissionRepository,
  UserPermissionRepository,
  UserRepository,
} from '../../orm/nas-auth/repositories/index.js'

export interface NasAuthGraphQLContext {
  connection: DataSource
  apiKey: string | string[] | undefined
  tokenUser: Record<string, string | number | boolean | null>
  applicationRepository: ApplicationRepository
  permissionRepository: PermissionRepository
  userPermissionRepository: UserPermissionRepository
  userRepository: UserRepository
  openTelemetry: () => OpenTelemetryReqInstance
}
