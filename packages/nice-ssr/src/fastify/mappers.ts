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
        req.raw.on('error', (error) => {
          controller.error(error)
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

async function writeRawResponse(response: Response, reply: FastifyReply): Promise<void> {
  reply.hijack()
  for (const [headerName, headerValue] of response.headers) {
    reply.raw.appendHeader(headerName, headerValue)
  }
  reply.raw.writeHead(response.status)

  const body = response.body
  if (body instanceof ReadableStream) {
    return await new Promise<void>((resolve, reject) => {
      const nodeStream = Readable.fromWeb(body as import('node:stream/web').ReadableStream)
      nodeStream.on('error', (err) => {
        try {
          reply.raw.destroy(err)
        } catch {
          // ignore errprs while destroying
        }
        reject(err)
      })
      reply.raw.on('error', (err) => reject(err))
      reply.raw.on('close', () => resolve())
      nodeStream.pipe(reply.raw)
    })
  } else {
    return new Promise<void>((resolve) => reply.raw.end(resolve))
  }
}

export async function writeResponse(response: Response, reply: FastifyReply, hijack?: boolean) {
  if (hijack) {
    await writeRawResponse(response, reply)
  } else {
    for (const [headerName, headerValue] of response.headers) {
      reply.header(headerName, headerValue)
    }
    reply.status(response.status)
    await reply.send(response)
  }
}
