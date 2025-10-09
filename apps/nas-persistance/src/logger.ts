import createLogger from '@melchor629/fastify-infra/logger'
import { logLevel } from './config.ts'

const logger = createLogger('nas-persistance', logLevel)

export default logger
