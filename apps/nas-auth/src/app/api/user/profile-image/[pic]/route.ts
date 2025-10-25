import fs2 from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'
import { SsrResponse } from '@melchor629/nice-ssr'
import { profileImagesPath } from '../../../../../config.ts'
import { getPermissions, withSession } from '../../../helper'

const mimeType: Record<string, `image/${string}` | undefined> = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  png: 'image/png',
}

export const GET = withSession<{ pic: string }>(async (request, { session: { accountId } }) => {
  const { pic } = request.nice.params
  const otherUser = request.nice.url.searchParams.get('user') || null
  if (otherUser) {
    const perms = await getPermissions(accountId)
    if (!perms.get('user')) {
      return new Response(null, {
        status: 403,
      })
    }
  }

  const userProfilePath = path.join(profileImagesPath, otherUser ?? accountId!)
  const imagePath = path.join(userProfilePath, pic)
  const id = path.extname(pic.slice(0, -path.extname(pic).length)).slice(1)
  const etag = `W/"${id}"`

  try {
    if (request.headers.has('if-none-match')) {
      if (request.headers.get('if-none-match') === etag) {
        return new Response(null, {
          status: 304,
          headers: {
            etag: `W/${id}`,
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
  } catch {
    return new Response(null, { status: 404 })
  }
}, { ensure: true })
