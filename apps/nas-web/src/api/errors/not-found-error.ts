import type { BasicError } from './basic-error'

export const NotFound = 'NotFound'
export interface NotFoundError extends BasicError<404, typeof NotFound> {
  method: string
  path: string
  originalUrl: string
}
