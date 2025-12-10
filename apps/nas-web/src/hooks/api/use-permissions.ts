import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAuth } from 'react-oidc-context'
import type { TokenPermissions } from '@/api/token/token-info'
import { getApiClient } from './query-client'

const usePermissions = (disabled?: boolean) => {
  const { settings: { authority } } = useAuth()
  return useQuery(useMemo(() => ({
    queryKey: ['auth', 'permissions'],
    queryFn: () => {
      const { get } = getApiClient()
      return get<TokenPermissions>(new URL('/token/permissions', authority).toString())
    },
    disabled,
    staleTime: 60_000,
  }), [authority, disabled]))
}

export default usePermissions
