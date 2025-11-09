import createLogger from '@melchor629/infra/logger'
import { logLevel } from './config.ts'

const logger = createLogger('nas-fs', logLevel)

export default logger
