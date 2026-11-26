import type { SsrRequest } from '@melchor629/nice-ssr'

const copyHeaderValue = (header: string, from: Headers, to: Headers) => {
  const value = from.get(header)
  if (value != null) {
    to.set(header, value)
  }
}

export async function GET(req: SsrRequest) {
  const headers = new Headers()
  copyHeaderValue('accept', req.headers, headers)
  copyHeaderValue('accept-encoding', req.headers, headers)
  copyHeaderValue('if-modified-since', req.headers, headers)
  copyHeaderValue('if-none-match', req.headers, headers)
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
