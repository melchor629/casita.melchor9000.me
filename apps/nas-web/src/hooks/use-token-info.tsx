import { Log } from 'oidc-client-ts'
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useAuth } from 'react-oidc-context'
import type { TokenApplication, TokenPermission } from '../api/token/token-info'
import { AppLoader } from '../components/loaders'
import usePermissions from './api/use-permissions'

if (import.meta.env.DEV) {
  Log.setLevel(Log.INFO)
  Log.setLogger(console)
}

interface TokenInfo {
  userName: string
  displayName: string
  permissions: TokenPermission[]
  applications: Record<string, TokenApplication>
}

export const TokenInfoContext = createContext<TokenInfo | null>(null)

export function TokenInfoProvider({ children }: PropsWithChildren) {
  const {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    activeNavigator, clearStaleState, error, isAuthenticated, isLoading, signinRedirect,
    user,
  } = useAuth()
  const { data: permissions } = usePermissions(isLoading || !user)
  const { profile } = user ?? {}

  const tokenInfo = useMemo((): TokenInfo | null => {
    if (!permissions || !profile) {
      return null
    }

    return {
      userName: profile.sub,
      displayName: profile.name!,
      ...permissions,
    }
  }, [profile, permissions])

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return
    }

    clearStaleState().catch(() => {})
  }, [isLoading, isAuthenticated, clearStaleState])

  switch (activeNavigator) {
    case 'signinSilent':
      return <AppLoader message="Signing you in..." navbarMargin />
    case 'signoutRedirect':
      return <AppLoader message="Logging out..." navbarMargin />
    default:
  }

  if (isLoading) {
    return <AppLoader message="Loading..." navbarMargin />
  }

  if (error) {
    // TODO improve screen
    return (
      <div>
        Failed login:
        {error.message}
      </div>
    )
  }

  if (!isAuthenticated) {
    sessionStorage.setItem('nas-web:redirect-path', window.location.pathname)
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw signinRedirect()
  }

  if (user && !permissions) {
    return <AppLoader message="Loading user permissions..." navbarMargin />
  }

  return <TokenInfoContext.Provider value={tokenInfo}>{children}</TokenInfoContext.Provider>
}

export function useTokenInfo(): TokenInfo {
  const tokenInfo = useContext(TokenInfoContext)

  if (tokenInfo === null) {
    throw new Error('TokenInfo is null, ensure useTokenInfo() is inside the provider context')
  }

  return tokenInfo
}
