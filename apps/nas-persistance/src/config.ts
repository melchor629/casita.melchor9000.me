export const env: 'prod' | 'dev' = (process.env.NODE_ENV || 'production').toLowerCase() === 'production' ? 'prod' : 'dev'
export const port = parseInt(process.env.PORT || '8003', 10)
export const pathPrefix = (process.env.PATH_PREFIX || process.env.NAS_PERSISTENCE_PATH_PREFIX)?.replace(/\/$/, '') ?? ''
export const logLevel = process.env.NAS_PERSISTENCE_LOG_LEVEL || (env === 'prod' ? 'info' : 'debug')

export const ormConfig = {
  cacheUrl: process.env.NAS_PERSISTENCE_CACHE_URL,
  psqlUrl: process.env.NAS_PERSISTENCE_PSQL_URL,
}

export const nasAuthApiKeys = (process.env.NAS_PERSISTENCE_AUTH_API_KEYS || '')
  .split(',')
  .map((apiKey) => apiKey.trim())
  .filter((apiKey) => !!apiKey)

export const authorities = (process.env.NAS_PERSISTENCE_AUTHORITIES || 'http://localhost:8001')
  .split(',')
  .map((authority) => authority.trim())
  .filter((authority) => !!authority)

export const otlp = Object.freeze({
  enabled: ['1', 'true', 'yes'].includes(process.env.NAS_PERSISTENCE_OTLP_ENABLED?.toLowerCase() || ''),
  url: process.env.NAS_PERSISTENCE_OTLP_URL,
})
