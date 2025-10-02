import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'
import { staticDirPath } from '@/config'

export async function GET(req: SsrRequest<{ level: string }>) {
  const filePath = path.resolve(staticDirPath, 'j', `dict.${req.nice.params.level}.yml`)
  req.nice.log.debug({ filePath }, 'Parsing japanese dictionary file')
  try {
    const raw = await readFile(filePath, 'utf-8')
    const yaml = (await import('js-yaml')).load(raw, { filename: filePath })
    return SsrResponse.json(yaml, {
      headers: { 'cache-control': 'no-cache' },
    })
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      return SsrResponse.new().status('not-found').empty()
    }

    req.nice.log.debug({ err, filePath }, 'Something failed while processing request')
    return SsrResponse.new().status('internal-server-error').empty()
  }
}
