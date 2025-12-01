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
