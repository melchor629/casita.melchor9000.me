import { PrismaClient } from '@melchor629/prisma-nas-auth'
import { getDatasourceUrl, wrapClient } from '../config.ts'

const nasAuthClient = wrapClient(new PrismaClient({
  datasourceUrl: getDatasourceUrl('auth'),
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
