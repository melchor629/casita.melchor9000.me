import type {} from 'vite/client'
import type {} from 'vite-plugin-pwa/client'
import type {} from 'vite-plugin-svgr/client'

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    readonly VITE_VERSION?: string
    readonly VITE_REVISION?: string
    readonly VITE_BUILD_DATE?: string
    readonly VITE_IDENTITY_AUTHORITY?: string
    readonly VITE_IDENTITY_CLIENT_ID?: string
    readonly VITE_IDENTITY_CLIENT_SECRET?: string
  }
}
