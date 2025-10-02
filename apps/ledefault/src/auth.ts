import { cache, type SsrRequest } from '@melchor629/nice-ssr'
import { traefikAuthUrl } from './config'

const loginEndpoint = new URL('/auth', traefikAuthUrl)
const userEndpoint = new URL('/me', traefikAuthUrl)

export const isLoggedIn = (req: { headers: Headers }) => req.headers.get('cookie')?.includes('ta-ls')

type LogInResults =
  | { type: 'redirect', cookies: string[], url: URL }
  | { type: 'logged-in' }
  | { type: 'server-error', status: number, body: string, headers: Record<string, string> }
  | { type: 'internal-error', err: unknown }
export const startLogIn = async (req: SsrRequest): Promise<LogInResults> => {
  const headers = new Headers(req.headers)
  headers.set('x-forwarded-method', 'get')
  headers.set('x-forwarded-proto', req.nice.url.protocol.slice(0, -1))
  headers.set('x-forwarded-host', req.nice.url.host)
  headers.set('x-forwarded-uri', req.nice.pathname.toString())
  try {
    const response = await fetch(loginEndpoint, {
      headers,
      redirect: 'manual',
    })
    if (response.status === 307) {
      return {
        type: 'redirect',
        cookies: response.headers.getSetCookie(),
        url: new URL(response.headers.get('location')!),
      }
    }

    if (response.status === 200) {
      return { type: 'logged-in' }
    }

    return {
      type: 'server-error',
      status: response.status,
      body: await response.text(),
      headers: Object.fromEntries(response.headers),
    }
  } catch (err) {
    return { type: 'internal-error', err }
  }
}

type GetUserResults =
  | { type: 'not-logged-in' }
  | { type: 'server-error', status: number, body: string }
  | { type: 'success', data: { sub: string } }
export const getUser = cache(async (req: { headers: Headers }): Promise<GetUserResults> => {
  if (!isLoggedIn(req)) {
    return { type: 'not-logged-in' }
  }

  const response = await fetch(userEndpoint, { headers: { cookie: req.headers.get('cookie')! } })
  if (response.status === 401) {
    return { type: 'not-logged-in' }
  }
  if (!response.ok) {
    return { type: 'server-error', status: response.status, body: await response.text() }
  }

  const data = await response.json() as { sub: string }
  return { type: 'success', data }
})
