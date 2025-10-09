import type { Prisma, PrismaClient } from '@melchor629/prisma-nas-auth'
import BaseRepository from '../../base-repository.ts'

export default class PermissionRepository extends BaseRepository<number, Prisma.TypeMap['model']['Permission']> {
  constructor(client: PrismaClient) {
    super(client.permission)
  }
}
