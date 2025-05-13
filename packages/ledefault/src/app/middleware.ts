import { SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'
import { isProduction } from '@/config'

export default function middleware(req: SsrRequest) {
  if (req.nice.url.pathname === '/w' || req.nice.url.pathname.startsWith('/w/')) {
    if (isProduction && !req.headers.get('cookie')?.includes('ta-ls')) {
      return SsrResponse.new().redirect(
        `/l?${new URLSearchParams({ r: req.nice.url.pathname })}`,
        'temporary',
      )
    }
  }

  return SsrResponse.next()
}
