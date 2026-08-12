import { drizzle } from 'drizzle-orm/node-postgres'
import { relations } from './relations.ts'
import createLogger from '@melchor629/infra/logger'

const logger = createLogger('orm-nas-auth')

const nasAuthDatabase = drizzle(process.env.DATABASE_URL!, {
  relations,
  jit: true,
  logger: {
    logQuery: (query, params) => logger.debug({ query, params }, 'Query run'),
  },
})

export default nasAuthDatabase
export * from 'drizzle-orm'
