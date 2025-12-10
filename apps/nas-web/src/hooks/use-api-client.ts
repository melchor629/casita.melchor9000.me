import { useCallback, useMemo } from 'react'
import { useAuth } from 'react-oidc-context'
import {
  type ApiClient, del, get, getRaw, patch, post, put,
} from '../api/api-client'

const useApiClient = (): ApiClient => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { signinSilent, user } = useAuth()

  const getToken = useCallback(async () => {
    if (!user) {
      return null
    }

    if (user.expired) {
      await signinSilent({ silentRequestTimeoutInSeconds: 5 })
    }

    return user.access_token
  }, [user, signinSilent])

  return useMemo(() => ({
    get: (url, req) => get(url, { ...req, getToken }),
    getRaw: ((url, type, req) => getRaw(url, type, { ...req, getToken })) as ApiClient['getRaw'],
    post: (url, body, req) => post(url, body, { ...req, getToken }),
    del: (url, req) => del(url, { ...req, getToken }),
    patch: (url, body, req) => patch(url, body, { ...req, getToken }),
    put: (url, body, req) => put(url, body, { ...req, getToken }),
    getAccessToken: getToken,
  }), [getToken])
}

export default useApiClient
