import type { BasicError } from './basic-error'

export type ServerError = BasicError<500, string>
