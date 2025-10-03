import { PassThrough, Readable, Transform } from 'node:stream'
import type { FastifyPluginAsync, FastifyReply } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

interface EventMessage {
  readonly id?: string
  readonly event?: string
  readonly data?: string
  readonly retry?: string
  readonly comment?: string
}

interface Options {
  configurePings?: true | number
}

interface Sse {
  readonly abortSignal: AbortSignal
  send(event: EventMessage): void
  end(reason?: Error): void
  then(onFullfilled: () => void, onRejected?: (error: Error) => void): void
}

declare module 'fastify' {
  interface FastifyReply {
    sse(opts?: Options): Readonly<Sse>
  }
}

async function * generatePings(signal: AbortSignal, interval: number): AsyncGenerator<EventMessage> {
  let pingNumber = 0
  do {
    yield {
      event: 'ping',
      data: JSON.stringify({ time: new Date() }),
      id: `ping:${pingNumber}`,
    }
    pingNumber += 1
    await new Promise((resolve) => {
      setTimeout(resolve, interval)
    })
  } while (!signal.aborted)
}

const serializeMessage = (event: EventMessage) => {
  let payload = ''
  if (event.id) {
    payload += `id: ${event.id}\n`
  }
  if (event.event) {
    payload += `event: ${event.event}\n`
  }
  if (event.data) {
    payload += `data: ${event.data}\n`
  }
  if (event.retry) {
    payload += `retry: ${event.retry}\n`
  }
  if (event.comment) {
    payload += `:${event.comment}\n`
  }
  if (!payload) {
    return ''
  }
  return `${payload}\n\n`
}

const ssePlugin: FastifyPluginAsync = (fastify) => {
  const connections: { reqId: string, abort: AbortController }[] = []
  fastify
    .decorateReply('sse', function sse(this: FastifyReply, opts: Options = {}): Readonly<Sse> {
      if (connections.find((c) => c.reqId === this.request.id)) {
        throw new Error('Server-Sent Events has already been configured')
      }

      const abort = new AbortController()
      const eventStream = new PassThrough({ objectMode: true, signal: abort.signal })
      const connection = { reqId: this.request.id, abort }
      connections.push(connection)

      this.header('Content-Type', 'text/event-stream; charset=utf-8')
      if (this.request.raw.httpVersionMajor < 2) {
        this.header('Connection', 'keep-alive')
      }
      this.header('Cache-Control', 'no-cache,no-transform')
      this.header('x-no-compression', '1')

      if (opts.configurePings) {
        Readable.from(generatePings(
          abort.signal,
          typeof opts.configurePings === 'number' ? opts.configurePings : 10_000,
        )).pipe(eventStream, { end: false })
      }

      // NOTE: this is never called when the browser closes connection through vite...
      this.request.raw.on('close', () => {
        abort.abort(new Error('Client has closed the connection'))
      })

      abort.signal.addEventListener('abort', () => {
        const idx = connections.indexOf(connection)
        if (idx !== -1) {
          connections.splice(idx, 1)
        }
      })

      const promise = this.send(eventStream.pipe(
        Transform.from(async function * transformEvent(source) {
          for await (const chunk of source) {
            const serialized = serializeMessage(chunk as EventMessage)
            if (serialized) {
              yield serialized
            }
          }
        }),
      ))

      return Object.freeze({
        then: promise.then.bind(promise),
        abortSignal: abort.signal,
        send(event) {
          eventStream.push(event)
        },
        end(reason) {
          abort.abort(reason ?? new Error('Called end'))
        },
      } satisfies Sse)
    })

  // NOTE: for some reason, the onClose hook is not being called if there are connections opened
  fastify.globalDisposables.push(() => {
    connections.forEach(({ abort }) => {
      abort.abort(new Error('Server is closing'))
    })
    connections.splice(0)
  })

  return Promise.resolve()
}

export default fastifyPlugin(ssePlugin, { name: 'sse' })
