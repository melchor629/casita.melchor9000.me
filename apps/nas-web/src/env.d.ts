/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="./changelog" />

import 'styled-components'

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

declare module 'styled-components' {
  export interface DefaultTheme {
    aspect: 'dark' | 'light'
  }
}
