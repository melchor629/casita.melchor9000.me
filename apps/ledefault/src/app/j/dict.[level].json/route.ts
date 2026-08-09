import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'
import { staticDirPath } from '@/config'

const isFresh = (fileStat: Awaited<ReturnType<typeof stat>>, req: SsrRequest) => {
  const ifModifiedSinceRaw = req.headers.get('if-modified-since')
  const mtimeWithoutMillis = fileStat.mtime.getTime() - fileStat.mtime.getMilliseconds()
  if (ifModifiedSinceRaw) {
    const ifModifiedSince = new Date(ifModifiedSinceRaw)
    return mtimeWithoutMillis === ifModifiedSince.getTime()
  }

  return false
}

export async function GET(req: SsrRequest<{ level: string }>) {
  const filePath = path.resolve(staticDirPath, 'j', `dict.${req.nice.params.level}.yml`)
  req.nice.log.debug({ filePath }, 'Parsing japanese dictionary file')
  try {
    const fileStat = await stat(filePath)
    const headers = {
      'content-type': 'application/json',
      'cache-control': 'max-age=60',
      date: fileStat.mtime.toUTCString(),
      'last-modified': fileStat.mtime.toUTCString(),
    }

    if (isFresh(fileStat, req)) {
      req.nice.log.debug('Request has updated content cached')
      return SsrResponse.new().status(304).empty()
    }

    req.nice.log.debug('Request points to outdated content')
    const raw = await readFile(filePath, 'utf-8')
    const yaml = (await import('js-yaml')).load(raw, { filename: filePath })
    return SsrResponse.json(yaml, {
      headers,
    })
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      return SsrResponse.new().status('not-found').empty()
    }

    req.nice.log.debug({ err, filePath }, 'Something failed while processing request')
    return SsrResponse.new().status('internal-server-error').empty()
  }
}
