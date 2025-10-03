import type { HttpError } from './http-error.ts'

/** @internal */
export default class UnauthorizedError extends Error implements HttpError<401> {
  public readonly statusCode = 401

  public readonly name = 'unauthorized'
}
