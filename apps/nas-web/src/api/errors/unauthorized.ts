import type { BasicError } from './basic-error'

export const Unauthorized = 'Unauthorized'
export type JwtError = BasicError<401, typeof Unauthorized>
