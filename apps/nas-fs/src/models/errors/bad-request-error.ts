import type { HttpError } from './http-error.ts'

/** @internal */
export default class BadRequestError extends Error implements HttpError<400> {
  readonly statusCode = 400
  readonly name = 'bad-request'
  readonly what?: string

  constructor(message: string, what?: string) {
    super(message)
    this.what = what
  }
}
