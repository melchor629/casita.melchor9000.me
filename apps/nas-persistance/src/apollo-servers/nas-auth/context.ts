import type { PrismaClient } from '@melchor629/prisma-nas-auth'
import type { FastifyRequest } from 'fastify'
import type {
  ApplicationRepository,
  PermissionRepository,
  UserPermissionRepository,
  UserRepository,
} from '../../orm/nas-auth/repositories/index.js'

export interface NasAuthGraphQLContext {
  prisma: PrismaClient
  applicationRepository: ApplicationRepository
  permissionRepository: PermissionRepository
  userPermissionRepository: UserPermissionRepository
  userRepository: UserRepository
  request: FastifyRequest
}
