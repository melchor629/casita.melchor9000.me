import { Readable } from 'node:stream'
import type { FastifyReply, FastifyRequest } from 'fastify'

function createHeaders(req: FastifyRequest): Headers {
  const headers = new Headers()
  for (const [headerName, headerValues] of Object.entries(req.headers)) {
    for (const headerValue of [headerValues].flat()) {
      headers.append(headerName, headerValue ?? '')
    }
  }
  return headers
}

export function createRequest(req: FastifyRequest, reply: FastifyReply, pathname?: string): Request {
  // based on https://github.com/mjackson/remix-the-web/blob/main/packages/node-fetch-server/src/lib/request-listener.ts
  const controller = new AbortController()
  reply.raw.on('close', () => controller.abort())

  const method = req.method ?? 'GET'
  const headers = createHeaders(req)
  const protocol = req.protocol
  const host = req.host
  const url = new URL(req.originalUrl, `${protocol}://${host}`)
  url.pathname = pathname ?? url.pathname

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

async function writeFastifyResponse(response: Response, reply: FastifyReply): Promise<void> {
  reply.status(response.status)

  for (const [headerName, headerValue] of response.headers) {
    reply.header(headerName, headerValue)
  }

  let body: unknown
  if (reply.request.method !== 'HEAD') {
    body = response.body
  }

  // compress does not support ReadableStream, better convert it to Readable
  if (body instanceof ReadableStream) {
    await reply.send(Readable.fromWeb(body as import('node:stream/web').ReadableStream))
  } else {
    await reply.send()
  }
}

async function writeRawResponse(response: Response, reply: FastifyReply): Promise<void> {
  reply.hijack()
  for (const [headerName, headerValue] of response.headers) {
    reply.raw.appendHeader(headerName, headerValue)
  }
  reply.raw.writeHead(response.status)

  const body = response.body
  if (body instanceof ReadableStream) {
    const promise = new Promise<void>((resolve) => reply.raw.on('close', resolve))
    Readable.fromWeb(body as import('node:stream/web').ReadableStream)
      .pipe(reply.raw)
    return promise
  } else {
    return new Promise<void>((resolve) => reply.raw.end(resolve))
  }
}

export async function writeResponse(response: Response, reply: FastifyReply, hijack?: boolean) {
  if (hijack) {
    await writeRawResponse(response, reply)
  } else {
    await writeFastifyResponse(response, reply)
  }
}
