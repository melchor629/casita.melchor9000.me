import type { BasicError } from './basic-error'

export const TokenExpired = 'TokenExpiredError'
export type TokenExpiredError = BasicError<401, typeof TokenExpired>
