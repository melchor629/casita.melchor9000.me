import { Readable } from 'node:stream'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type * as EntryServer from '../entry/server.ts'

function createHeaders(req: FastifyRequest): Headers {
  const headers = new Headers()
  for (const [headerName, headerValues] of Object.entries(req.headers)) {
    for (const headerValue of [headerValues].flat()) {
      headers.append(headerName, headerValue ?? '')
    }
  }
  return headers
}

export function createRequest(req: FastifyRequest, reply: FastifyReply): Request {
  // based on https://github.com/mjackson/remix-the-web/blob/main/packages/node-fetch-server/src/lib/request-listener.ts
  const controller = new AbortController()
  reply.raw.on('close', () => controller.abort())

  const method = req.method ?? 'GET'
  const headers = createHeaders(req)
  const protocol = req.protocol
  const host = req.host
  const url = new URL(req.originalUrl, `${protocol}://${host}`)

  const init: RequestInit = {
    method,
    headers,
    signal: controller.signal,
  }

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = new ReadableStream({
      start(controller) {
        req.raw.on('data', (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength))
        })
        req.raw.on('end', () => {
          controller.close()
        })
      },
    });
    // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex
    (init as { duplex: 'half' }).duplex = 'half'
  }

  return new Request(url, init)
}

export async function writeResponse(response: Response, reply: FastifyReply, server: typeof EntryServer): Promise<void> {
  reply.status(response.status)

  for (const [headerName, headerValue] of response.headers) {
    reply.header(headerName, headerValue)
  }

  let body: unknown
  if (reply.request.method !== 'HEAD') {
    if (server.isSsrResponse(response)) {
      body = server.extractBodyFromSsrResponse(response)
    } else if (response.body != null) {
      body = response.body
    }
  }

  // compress does not support ReadableStream, better convert it to Readable
  if (body instanceof ReadableStream) {
    await reply.send(Readable.fromWeb(body as import('node:stream/web').ReadableStream))
  } else {
    await reply.send(body)
  }
}
