import path from 'node:path'

if (!process.env.AUTH_API_BASE_URL) {
  console.error('AUTH_API_BASE_URL is not set')
  process.exit(1)
}

export const port = parseInt(process.env.PORT || '8000', 10)
export const pathPrefix = process.env.PATH_PREFIX

export const apps = Object.fromEntries(
  Object.keys(process.env)
    .map((key) => /APP_(\w+)_IDENTIFIER/.exec(key)?.[1])
    .filter((key): key is string => key !== undefined)
    .map((appKey) => {
      const appIdentifier = process.env[`APP_${appKey}_IDENTIFIER`]!
      const appStoragePath = process.env[`APP_${appKey}_STORAGE_PATH`]
      const appThumbnailPath = process.env[`APP_${appKey}_THUMBNAIL_PATH`]
      const appUploadPath = process.env[`APP_${appKey}_UPLOAD_PATH`]
      const plexLibraryId = process.env[`APP_${appKey}_PLEX_LIBRARY_ID`]
      const jellyfinLibraryId = process.env[`APP_${appKey}_JELLYFIN_LIBRARY_ID`]

      if (!appStoragePath) {
        console.error(`APP_${appKey}_STORAGE_PATH is not set`)
        process.exit(1)
      }

      const storagePath = path.resolve(appStoragePath)
      return [appIdentifier, {
        identifier: appIdentifier,
        storagePath,
        thumbnailPath: path.resolve(appThumbnailPath || path.join(storagePath, '.thumbnail')),
        uploadPath: path.resolve(appUploadPath || path.join(storagePath, '.upload')),
        plexLibraryId,
        jellyfinLibraryId,
      }]
    }),
)
export const authApiBaseUrl = process.env.AUTH_API_BASE_URL.replace(/\/$/, '')

export const authApplicationKey = process.env.AUTH_APPLICATION_KEY || 'nas-fs'

export const redisUrl = process.env.REDIS_URL

export const rateLimiter = {
  requestsPerSecond: parseInt(process.env.RATE_LIMITER_REQ_PER_SECOND || '50', 10),
  timeWindow: process.env.RATE_LIMITER_TIME_WINDOW || '1s',
  allowList: (process.env.RATE_LIMITER_ALLOW_LIST || '127.0.0.1').split(','),
}

export const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

export const plexUrl = process.env.PLEX_URL

export const plexToken = process.env.PLEX_TOKEN

export const otlp = Object.freeze({
  enabled: ['1', 'true', 'yes'].includes(process.env.OTLP_ENABLED?.toLowerCase() || ''),
  url: process.env.OTLP_URL,
})

if (Object.keys(apps).length === 0) {
  console.error('No apps defined. One must be defined at least with APP_key_IDENTIFIER and APP_key_STORAGE_PATH')
  process.exit(1)
}
