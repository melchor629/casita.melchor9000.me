import { SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'
import { isLoggedIn, startLogIn } from '@/auth'

export async function GET(req: SsrRequest) {
  if (isLoggedIn(req)) {
    const r = req.nice.url.searchParams.get('r') ?? ''
    if (r.startsWith('/') && !r.startsWith('//') && URL.canParse(r, req.nice.url.origin)) {
      return SsrResponse.new().redirect(r as `/${string}`)
    }
    return SsrResponse.new().redirect('/')
  }

  const result = await startLogIn(req)
  if (result.type === 'redirect') {
    req.nice.log.debug({ location: result.url }, 'Redirect for login')
    return SsrResponse.new()
      .header('set-cookie', result.cookies)
      .redirect(result.url)
  } else if (result.type === 'server-error') {
    req.nice.log.info({
      status: result.status,
      body: result.body,
      headers: result.headers,
    }, 'Cannot login')
    return SsrResponse.new().status('internal-server-error').empty()
  } else if (result.type === 'logged-in') {
    const r = req.nice.url.searchParams.get('r') ?? ''
    if (r.startsWith('/') && !r.startsWith('//') && URL.canParse(r, req.nice.url.origin)) {
      return SsrResponse.new().redirect(r as `/${string}`)
    }
    return SsrResponse.new().redirect('/')
  } else {
    req.nice.log.warn({ err: result.err }, 'Cannot start login')
    return SsrResponse.new().status('internal-server-error').empty()
  }
}
