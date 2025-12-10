import { nanoid } from 'nanoid'
import type { CodeHighlightRequest, CodeHighlightResponse } from './types'

const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })

const requests = new Map<string, {
  resolve(value: CodeHighlightResponse): void
  reject(reason: unknown): void
  signal: AbortSignal | undefined
}>()

worker.addEventListener('message', (ev: MessageEvent<CodeHighlightResponse>) => {
  const { reqId } = ev.data
  const request = requests.get(reqId)
  if (request) {
    requests.delete(reqId)
    request.resolve(ev.data)
  }
})

const highlightCode = async (
  request: Omit<CodeHighlightRequest, 'reqId'>,
  signal?: AbortSignal,
): Promise<CodeHighlightResponse> => {
  const reqId = nanoid()
  return new Promise((resolve, reject) => {
    requests.set(reqId, {
      resolve,
      reject,
      signal,
    })
    signal?.addEventListener('abort', () => {
      const req = requests.get(reqId)
      if (req) {
        requests.delete(reqId)
        req.reject(req.signal?.reason)
      }
    })
    worker.postMessage({
      ...request,
      reqId,
    })
  })
}

export default highlightCode
