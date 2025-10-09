import { ormConfig } from '../config.ts'
import logger from '../logger.ts'

const {
  psqlUrl,
} = ormConfig

export const getDatasourceUrl = (schema: string) => {
  const url = new URL(psqlUrl!)
  url.searchParams.append('schema', schema)
  return url.toString()
}

type QueryEvent = {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}
type LogEvent = {
  timestamp: Date
  message: string
  target: string
}
export const wrapClient = <T extends {
  $on<V extends 'query' | 'error' | 'warn' | 'info'>(eventType: V, callback: (event: V extends 'query' ? QueryEvent : LogEvent) => void): void
}>(client: T) => {
  const ormLogger = logger.child({ module: 'prisma' })
  client.$on('query', (event) => {
    ormLogger.debug({ duration: event.duration, query: event.query, params: event.params }, 'Query run')
  })
  client.$on('error', (event) => {
    ormLogger.error({ target: event.target }, event.message)
  })
  client.$on('warn', (event) => {
    ormLogger.warn({ target: event.target }, event.message)
  })
  client.$on('info', (event) => {
    ormLogger.info({ target: event.target }, event.message)
  })
  return client
}
