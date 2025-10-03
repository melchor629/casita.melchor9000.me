import os from 'node:os'
import typeorm from 'typeorm'
import { ormConfig } from '../config.js'
import logger from '../logger.js'

const {
  cacheUrl,
  psqlUrl,
} = ormConfig

const getCacheSettings = (): typeorm.DataSourceOptions['cache'] => {
  if (!cacheUrl) {
    return undefined
  }

  const url = new URL(cacheUrl)
  const [pathname] = url.pathname.replace(/^\//, '').split('/')
  if (url.protocol === 'redis:') {
    return {
      type: 'redis',
      options: {
        port: parseInt(url.port || '6379', 10),
        host: url.hostname || 'localhost',
        connectionName: `nas-persistence:${os.hostname()}`,
        db: parseInt(pathname || '0', 10),
        password: url.password || undefined,
        username: url.username || undefined,
        keyPrefix: 'nas-persistence:typeorm:',
      },
    }
  }
  if (url.protocol === 'database:') {
    return {
      type: 'database',
      tableName: pathname || undefined,
    }
  }

  throw new Error(`Unknown cache schema ${url.protocol}`)
}

const getLogger = (): typeorm.Logger => {
  const ormLogger = logger.child({ module: 'typeorm' })
  return {
    logQuery(query, parameters) {
      if (ormLogger.isLevelEnabled('debug')) {
        const sql = query + (parameters && parameters.length ? ` -- PARAMS: ${JSON.stringify(parameters)}` : '')
        ormLogger.debug({ type: 'query', query, parameters }, `QUERY: ${sql}`)
      }
    },
    logQueryError(error, query, parameters) {
      if (ormLogger.isLevelEnabled('error')) {
        const sql = query + (parameters && parameters.length ? ` -- PARAMS: ${JSON.stringify(parameters)}` : '')
        ormLogger.error({ err: error, type: 'query-failed', query, parameters }, `QUERY FAILED: ${sql}`)
      }
    },
    logQuerySlow(time, query, parameters) {
      if (ormLogger.isLevelEnabled('warn')) {
        const sql = query + (parameters && parameters.length ? ` -- PARAMS: ${JSON.stringify(parameters)}` : '')
        ormLogger.warn({
          type: 'slow-query',
          query,
          parameters,
          time,
        }, `SLOW QUERY: ${sql} (took ${time}ms)`)
      }
    },
    logSchemaBuild(message) {
      ormLogger.debug({ type: 'schema-build' }, message)
    },
    logMigration(message) {
      ormLogger.info({ type: 'migration' }, message)
    },
    log(level, message) {
      switch (level) {
        case 'log':
          ormLogger.debug(message)
          break
        case 'info':
          ormLogger.info(message)
          break
        case 'warn':
          ormLogger.warn(message)
          break
        default:
          ormLogger.debug(message)
      }
    },
  }
}

const baseOptions: typeorm.DataSourceOptions & { type: 'postgres' } = {
  type: 'postgres',
  url: psqlUrl,

  applicationName: 'nas-persistence',
  synchronize: false,
  logging: 'all',
  logger: getLogger(),

  cache: getCacheSettings(),
}

export default baseOptions
