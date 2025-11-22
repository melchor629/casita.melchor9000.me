import { PrismaClient } from '@melchor629/prisma-nas-auth'
import { PrismaPg } from '@prisma/adapter-pg'
import { getDatasourceUrl, wrapClient } from '../config.ts'

const adapter = new PrismaPg({
  connectionString: getDatasourceUrl('auth'),
})

const nasAuthClient = wrapClient(new PrismaClient({
  adapter,
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
}))

export default nasAuthClient
