import os from 'node:os'
import { pino } from 'pino'
import { logLevel } from './config.ts'

const logger = pino({
  base: {
    pid: process.pid,
    hostname: os.hostname,
    service: 'nas-fs',
  },
  level: logLevel,
  transport: process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: { colorize: true },
      }
    : undefined,
})

export default logger
