import fs2 from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'
import { SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'
import { getUser } from '#queries/index.ts'
import { profileImagesPath } from '../../../../../config.ts'

const mimeType: Record<string, `image/${string}` | undefined> = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  png: 'image/png',
  svg: 'image/svg+xml',
}

const nasAuthImageUrl = 'nas-auth://'

export const GET = async (request: SsrRequest<{ username: string }>) => {
  const { username } = request.nice.params
  const user = await getUser({ userName: username }, {})
  if (!user) {
    return SsrResponse.new().status('not-found').empty()
  }

  try {
    if (!user.profileImageUrl) {
      const etag = `W/"g:${username}"`
      if (request.headers.has('if-none-match')) {
        if (request.headers.get('if-none-match') === etag) {
          return new Response(null, {
            status: 304,
            headers: {
              etag,
            },
          })
        }
      }

      return SsrResponse.new()
        .status(200)
        .header('content-type', mimeType.svg)
        .header('last-modified', new Date().toUTCString())
        .header('etag', etag)
        .raw(Buffer.from(`
          <?xml version="1.0" encoding="UTF-8" standalone="no"?>
          <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="256" height="256" fill="#ff8904" />
            <text x="128" y="128" font-size="100" fill="#000" text-anchor="middle" alignment-baseline="central">${`${user.givenName?.slice(0, 1) ?? ''}${user.familyName?.slice(0, 1) ?? ''}`.trim() || user.userName.slice(0, 2)}</text>
          </svg>
        `.trim(), 'utf-8'))
    }

    if (user.profileImageUrl.startsWith(nasAuthImageUrl)) {
      const pic = user.profileImageUrl.slice(nasAuthImageUrl.length)
      const userProfilePath = path.join(profileImagesPath, username)
      const imagePath = path.join(userProfilePath, pic)
      const id = path.extname(pic.slice(0, -path.extname(pic).length)).slice(1)
      const etag = `W/"${id}"`

      if (request.headers.has('if-none-match')) {
        if (request.headers.get('if-none-match') === etag) {
          return new Response(null, {
            status: 304,
            headers: {
              etag,
            },
          })
        }
      }

      const stat = await fs.stat(imagePath)
      if (request.headers.has('if-modified-since')) {
        const parsed = new Date(request.headers.get('if-modified-since') || '')
        if (!Number.isNaN(+parsed) && +parsed === +stat.mtime) {
          return new Response(null, {
            status: 304,
            headers: {
              'last-modified': stat.mtime.toUTCString(),
              etag,
            },
          })
        }
      }

      const stream = fs2.createReadStream(imagePath)
      return SsrResponse.new()
        .status(200)
        .header('content-type', mimeType[path.extname(imagePath).slice(1)] || 'image/webp')
        .header('content-length', stat.size.toString(10))
        .header('last-modified', stat.mtime.toUTCString())
        .header('etag', etag)
        .stream(Readable.toWeb(stream) as unknown as ReadableStream)
    }

    const headers = new Headers([
      ['accept', request.headers.get('accept') ?? 'image/*'],
      ['if-none-match', request.headers.get('if-none-match')],
      ['if-none-since', request.headers.get('if-modified-since')],
    ].filter((p): p is [string, string] => !!p[1]))
    const response = await fetch(user.profileImageUrl, {
      headers,
      signal: request.signal,
    })

    if (!response.ok && response.status !== 304) {
      request.nice.log.warn({ status: response.status }, 'Upstream responded with not ok status')
      return new Response(null, { status: 404 })
    }

    const res = SsrResponse.new()
      .header('content-type', response.headers.get('content-type'))
      .header('etag', response.headers.get('etag'))
      .header('last-modified', response.headers.get('last-modified'))
      .header('cache-control', response.headers.get('cache-control') ?? 'public max-age=86400')
      .header('expires', response.headers.get('expires') ?? new Date(Date.now() + 86400).toUTCString())
      .header('age', response.headers.get('age'))
      .status(response.status)
    if (response.body) return res.stream(response.body)
    return res.empty()
  } catch (err) {
    request.nice.log.warn({ err }, 'Could not retrieve user profile image')
    return new Response(null, { status: 500 })
  }
}
