// eslint-disable-next-line import-x/prefer-default-export
export const env = Object.freeze({
  apiUrl: import.meta.env.VITE_API_URL?.replace(/\/$/, '') || `${window.location.origin}/api`,
  baseName: import.meta.env.BASE_URL,
  version: import.meta.env.VITE_VERSION || '0.0.0',
  revision: import.meta.env.VITE_REVISION || 'no-rev',
  buildDate: new Date(import.meta.env.VITE_BUILD_DATE ?? 0),
  identity: Object.freeze({
    authority: import.meta.env.VITE_IDENTITY_AUTHORITY?.replace(/\/$/, '') || 'http://localhost:8001',
    clientId: import.meta.env.VITE_IDENTITY_CLIENT_ID || 'nas-fs',
    clientSecret: import.meta.env.VITE_IDENTITY_CLIENT_SECRET,
    redirectUri: `${new URL(import.meta.env.BASE_URL, window.location.origin).toString().replace(/\/$/, '')}/auth`,
  }),
})
