export async function GET(req: Request) {
  const fontReq = new Request('https://furifont.antfu.me/fonts/FurifontSansVF.woff2', {
    headers: new Headers(req.headers),
  })
  fontReq.headers.set('origin', 'https://furifont.antfu.me')

  const fontRes = await fetch(fontReq)
  if (fontRes.ok || fontRes.status === 304) {
    return fontRes
  }

  return new Response(null, { status: 404 })
}
