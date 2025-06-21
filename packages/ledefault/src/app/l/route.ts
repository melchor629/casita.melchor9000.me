import { SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'

export async function GET(req: SsrRequest) {
  if (req.headers.get('cookie')?.includes('ta-ls')) {
    const r = req.nice.url.searchParams.get('r') ?? ''
    if (r.startsWith('/') && !r.startsWith('//') && URL.canParse(r, req.nice.url.origin)) {
      return SsrResponse.new().redirect(r as `/${string}`)
    }
    return SsrResponse.new().redirect('/')
  }

  const headers = new Headers(req.headers)
  headers.set('x-forwarded-method', 'get')
  headers.set('x-forwarded-scheme', req.nice.url.protocol)
  headers.set('x-forwarded-host', req.nice.url.host)
  headers.set('x-forwarded-uri', req.nice.url.toString())
  try {
    const response = await fetch('http://traefik-auth:8080/auth', {
      headers,
      redirect: 'manual',
    })
    if (response.status === 307) {
      const r = SsrResponse.redirect(response.headers.get('location')!)
      response.headers.getSetCookie().forEach((cookie) => r.headers.append('set-cookie', cookie))
      return r
    }

    req.nice.log.info({
      status: response.status,
      body: await response.text(),
      headers: Object.fromEntries(response.headers),
    }, 'Cannot login')
    return SsrResponse.new().status('internal-server-error').empty()
  } catch (err) {
    req.nice.log.warn({ err }, 'Cannot start login')
    return SsrResponse.new().status('internal-server-error').empty()
  }
}
