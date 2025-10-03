import type { HttpError } from './http-error.ts'

/** @internal */
export default class NotFoundError extends Error implements HttpError<404> {
  readonly statusCode = 404
  readonly name = 'not-found'
  readonly what?: string

  constructor(message: string, what?: string) {
    super(message)
    this.what = what
  }
}
