import type { Prisma, PrismaClient } from '@melchor629/prisma-nas-auth'
import BaseRepository from '../../base-repository.ts'

export default class UserPermissionRepository extends BaseRepository<number, Prisma.TypeMap['model']['UserPermission']> {
  constructor(client: PrismaClient) {
    super(client.userPermission)
  }
}
