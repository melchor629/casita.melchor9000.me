/** @internal */
export type HttpErrorStatusCodes = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410
| 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 426 | 428 | 429 | 431 | 451 | 500 | 501 |
502 | 503 | 504 | 505 | 506 | 510 | 511

/** @internal */
export interface HttpError<Code extends HttpErrorStatusCodes> extends Error {
  readonly statusCode: Code
}
