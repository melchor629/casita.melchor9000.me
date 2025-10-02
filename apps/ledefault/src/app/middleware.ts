import { SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'
import { isLoggedIn } from '@/auth'
import { isProduction } from '@/config'

export default function middleware(req: SsrRequest) {
  if (req.nice.url.pathname === '/w' || req.nice.url.pathname.startsWith('/w/')) {
    if (isProduction && !isLoggedIn(req)) {
      return SsrResponse.new().redirect(
        `/l?${new URLSearchParams({ r: req.nice.url.pathname })}`,
        'temporary',
      )
    }
  }

  return SsrResponse.next()
}
