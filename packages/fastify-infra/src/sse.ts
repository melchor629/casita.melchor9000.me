import { PassThrough, Readable, Transform } from 'node:stream'
import type { FastifyPluginAsync, FastifyReply } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

type EventMessage = Readonly<{
  id?: string
  event?: string
  data?: string
  retry?: string
  comment?: string
}>

interface Options {
  configurePings?: true | number
}

interface Sse {
  /**
   * Signal that tells when the connection is closed for any reason.
   */
  readonly abortSignal: AbortSignal
  /**
   * Sends an event through the channel. The message will be send asynchronously
   * soon after this is called.
   * @param event Event to send to the requester.
   */
  send(event: EventMessage): void
  /**
   * Ends the channel.
   * @param reason The reason of why it is ended, if it matters.
   */
  end(reason?: Error): void
  then(onFullfilled: () => void, onRejected?: (error: Error) => void): void
}

declare module 'fastify' {
  interface FastifyReply {
    /**
     * Replies this connection with Server-Sent Events.
     * @param opts Options for the Server-Sent Events reply.
     */
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
  fastify.addHook('preClose', () => {
    connections.forEach(({ abort }) => {
      abort.abort(new Error('Server is closing'))
    })
    connections.splice(0)
    return Promise.resolve()
  })
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
      this.request.cancelSignal.addEventListener('abort', () => {
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

  return Promise.resolve()
}

export default fastifyPlugin(ssePlugin, {
  name: '@melchor629/fastify-infra/sse',
  dependencies: ['@melchor629/fastify-infra/abort'],
})
