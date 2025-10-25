import { SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'
import { runAction } from './server/index.ts'

export async function POST(req: SsrRequest) {
  const log = req.nice.log.child({ module: 'actions' })
  const action = req.headers.get('x-nice-action')
  if (typeof action !== 'string') {
    log.debug('Missing action header')
    return SsrResponse.new().status(400).empty()
  }

  const inputFormat = req.headers.get('x-nice-format')
  if (typeof inputFormat !== 'string') {
    log.debug('Missing input format header')
    return SsrResponse.new().status(400).empty()
  }

  let args: unknown[]
  if (inputFormat === 'fd') {
    args = [await req.formData()]
  } else if (inputFormat === 's') {
    args = [new URLSearchParams(await req.text())]
  } else if (inputFormat === 'b') {
    args = [await req.blob()]
  } else if (inputFormat === 'j') {
    args = await req.json() as unknown[]
  } else {
    log.debug({ action, inputFormat }, 'Invalid input format')
    return SsrResponse.new().status(400).empty()
  }

  log.debug({ action, inputFormat }, 'Invoking action')
  return SsrResponse.json(await runAction(action as never, req, ...args))
}
