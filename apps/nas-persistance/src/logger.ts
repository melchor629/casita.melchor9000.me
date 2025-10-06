import createLogger from '@melchor629/fastify-infra/logger'
import { logLevel } from './config.js'

const logger = createLogger('nas-persistance', logLevel)

export default logger
