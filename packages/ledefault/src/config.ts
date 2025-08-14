export const isProduction = process.env.NODE_ENV === 'production'
export const port = parseInt(process.env.PORT || '8000', 10)
export const base = process.env.BASE || '/'
export const staticDirPath = process.env.STATIC_DIR_PATH || './static'
export const logLevel = process.env.LOG_LEVEL || 'info'
export const enableExtraSecurity = process.env.ENABLE_EXTRA_SECURITY != null
export const traefikAuthUrl = new URL(process.env.TRAEFIK_AUTH_URL || 'http://traefik-auth:8080')
