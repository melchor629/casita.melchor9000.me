import type { HttpError } from './http-error.ts'

/** @internal */
export default class ForbiddenError extends Error implements HttpError<403> {
  readonly statusCode = 403
  readonly name = 'forbidden'
  readonly what?: string

  constructor(message: string, what?: string) {
    super(message)
    this.what = what
  }
}
