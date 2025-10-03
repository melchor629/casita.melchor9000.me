import { pino } from 'pino'
import { env, logLevel } from './config.js'

export default pino({
  level: logLevel,
  transport: env === 'dev'
    ? {
        target: 'pino-pretty',
        options: {
          translateTime: true,
          colorize: true,
        },
      }
    : undefined,
})
