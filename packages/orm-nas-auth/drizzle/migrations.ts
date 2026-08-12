import process from 'node:process'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import createLogger from '@melchor629/infra/logger'

const migrationLogger = createLogger('orm-nas-auth:migrations')

export default async function runNasAuthMigrations() {
  const db = drizzle(process.env.DATABASE_URL!, {
    logger: {
      logQuery: (query, params) => migrationLogger.info({ query, params }, 'Running query')
    },
  })

  migrationLogger.warn('Starting migrations')

  try {
    await migrate(db, {
      migrationsFolder: `${import.meta.dirname}/migrations`,
      migrationsSchema: 'auth',
      migrationsTable: '__drizzle_migrations',
    })
    migrationLogger.warn('Migrations finished')
  } catch (error) {
    migrationLogger.error({ err: error }, 'Migrations failed')
    throw error
  }
}
