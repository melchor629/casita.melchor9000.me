import type { Prisma, PrismaClient } from '@melchor629/prisma-nas-auth'
import BaseRepository from '../../base-repository.ts'

export default class UserRepository extends BaseRepository<number, Prisma.TypeMap['model']['User']> {
  constructor(client: PrismaClient) {
    super(client.user)
  }
}
