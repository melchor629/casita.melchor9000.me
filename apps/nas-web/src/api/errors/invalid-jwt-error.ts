import type { BasicError } from './basic-error'

export const InvalidJwt = 'JsonWebTokenError'
export type JwtError = BasicError<401, typeof InvalidJwt>
