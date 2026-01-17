import { Helmet, HelmetProvider } from '@dr.pogodin/react-helmet'
import { Suspense } from 'react'
import { AuthProvider } from 'react-oidc-context'
import { AppLoader } from './components/loaders'
import NasQueryConfig from './components/nas-query-config'
import ThemeProvider from './components/theme-provider'
import { TokenInfoProvider } from './hooks/use-token-info'
import AppRoutes from './pages'
import { env } from './utils/config'

function AppMain() {
  return (
    <HelmetProvider>
      <Suspense fallback={<AppLoader message="Loading app..." />}>
        <Helmet titleTemplate="%s - NAS Web" defaultTitle="NAS Web" />

        <ThemeProvider>
          <AuthProvider
            authority={env.identity.authority}
            client_id={env.identity.clientId}
            client_secret={env.identity.clientSecret}
            scope="openid profile offline_access"
            redirect_uri={env.identity.redirectUri}
            silent_redirect_uri={env.identity.redirectUri}
            silentRequestTimeoutInSeconds={10}
            accessTokenExpiringNotificationTimeInSeconds={120}
          >
            <NasQueryConfig>
              <TokenInfoProvider>
                <AppRoutes />
              </TokenInfoProvider>
            </NasQueryConfig>
          </AuthProvider>
        </ThemeProvider>
      </Suspense>
    </HelmetProvider>
  )
}

export default AppMain
