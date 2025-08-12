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
  headers.set('x-forwarded-proto', req.nice.url.protocol)
  headers.set('x-forwarded-host', req.nice.url.hostname)
  headers.set('x-forwarded-uri', req.nice.pathname.toString())
  try {
    const response = await fetch('http://traefik-auth:8080/auth', {
      headers,
      redirect: 'manual',
    })
    if (response.status === 307) {
      return SsrResponse.new()
        .header('set-cookie', response.headers.getSetCookie())
        .redirect(new URL(response.headers.get('location')!))
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
