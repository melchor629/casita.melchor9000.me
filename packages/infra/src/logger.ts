import os from 'node:os'
import { trace } from '@opentelemetry/api'
import { pino, type BaseLogger, type LevelWithSilentOrString } from 'pino'

export type Logger = Omit<BaseLogger, 'msgPrefix'> & {
  child(bindings: Record<string, unknown>): Logger
}

const mixin = () => {
  const span = trace.getActiveSpan()
  if (span) {
    const spanContext = span.spanContext()
    return {
      telemetry: {
        traceId: spanContext.traceId,
        spanId: spanContext.spanId,
      },
    }
  }

  return {}
}

const createLogger = (service: string, logLevel: LevelWithSilentOrString = 'info') =>
  pino({
    base: {
      pid: process.pid,
      hostname: os.hostname,
      service,
    },
    level: logLevel,
    mixin,
    formatters: {
      level: (label) => ({ level: label }),
    },
    serializers: {
      req: (req: import('fastify').FastifyRequest) => {
        const url = new URL(req.url, 'https://example.com')
        url.searchParams.delete('token')
        return {
          method: req.method,
          path: url.pathname,
          search: url.searchParams.toString(),
          params: req.params,
          host: url.host,
          remote: req.ip,
        }
      },
      res: (reply: import('fastify').FastifyReply) => {
        return {
          status: reply.statusCode,
          contentType: reply.getHeader('content-type'),
          contentLength: parseInt(reply.getHeader('content-length') as string || '-1', 10),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          user: (reply.request as any).jwtToken?.payload?.sub,
        }
      },
    },
    transport: process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss.l Z',
          },
        }
      : undefined,
  })

export default createLogger
