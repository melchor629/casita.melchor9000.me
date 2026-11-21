import type { SsrRequest } from '@melchor629/nice-ssr'

export async function GET(req: SsrRequest) {
  const headers = new Headers(req.headers)
  headers.delete('cookie')
  headers.delete('referer')
  headers.set('origin', 'https://furifont.antfu.me')
  const fontReq = new Request('https://furifont.antfu.me/fonts/FurifontSansVF.woff2', {
    headers,
  })

  const fontRes = await fetch(fontReq)
  if (fontRes.ok || fontRes.status === 304) {
    return fontRes
  }

  const output = await fontRes.text()
  req.nice.log.warn(
    { output, status: fontRes.status, headers: Object.fromEntries(fontRes.headers.entries()) },
    'Loading furifont failed',
  )
  return new Response(null, { status: 404 })
}
