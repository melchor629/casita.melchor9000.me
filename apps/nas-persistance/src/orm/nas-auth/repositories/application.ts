import type { Prisma, PrismaClient } from '@melchor629/prisma-nas-auth'
import BaseRepository from '../../base-repository.ts'

export default class ApplicationRepository extends BaseRepository<number, Prisma.TypeMap['model']['Application']> {
  constructor(client: PrismaClient) {
    super(client.application)
  }
}
