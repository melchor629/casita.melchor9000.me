import path from 'node:path'

export const port = parseInt(process.env.PORT || '8000', 10)
export const isDebug = process.env.NODE_ENV !== 'production'
export const logLevel = process.env.LOG_LEVEL || 'debug'
export const publicUrl = process.env.PUBLIC_URL || `http://localhost:${port}`
export const redisUrl = process.env.REDIS_URL || 'redis://localhost'
export const redisPrefix = process.env.REDIS_PREFIX || 'nas-auth:'
export const nasPersistenceUrl = new URL(process.env.NAS_PERSISTENCE_URL || 'http://localhost:8003/')
export const nasPersistenceApiKey = process.env.NAS_PERSISTENCE_API_KEY

export const jwksFilePath = process.env.JWKS_FILE_PATH || './jwks.json'
export const cookieKeysOauth = (process.env.OAUTH_COOKIE_KEYS || 'some,bodyoncetoldme').split(',')
export const cookieKeysDefault = (process.env.DEFAULT_COOKIE_KEYS || cookieKeysOauth.join(',')).split(',')
export const sessionSignKey = (process.env.SESSION_SIGN_KEY || cookieKeysDefault.join(',')).split(',')

export const googleClientId = process.env.GOOGLE_CLIENT_ID
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

export const githubClientId = process.env.GITHUB_CLIENT_ID
export const githubClientSecret = process.env.GITHUB_CLIENT_SECRET

export const profileImagesPath = path.resolve(process.env.PROFILE_IMAGES_PATH || './profile-images')

export const otlp = Object.freeze({
  enabled: ['1', 'true', 'yes'].includes(process.env.OTLP_ENABLED?.toLowerCase() || ''),
  url: process.env.OTLP_URL,
})
