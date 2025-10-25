export type FailableError = Readonly<{
  message: string
  name: string
  cause?: FailableError
}>

export type FailableValidationFields = ReadonlyArray<Readonly<{
  name: string
  messages: ReadonlyArray<string>
}>>

export type FailableResult<TResult> = Readonly<
  | readonly [kind: 'k', v: TResult]
  | readonly [kind: 'e', e: FailableError]
  | readonly [kind: 'v', f: FailableValidationFields]
  | readonly [kind: 'f', m: string]
>

const mapError = (error: Error): FailableError => ({
  message: error.message,
  name: error.name,
  cause: error.cause instanceof Error ? mapError(error.cause) : undefined,
})

export const ok = <T>(value: T): FailableResult<T> => Object.freeze([
  'k',
  value,
])

export const invalid = <T = never>(fields: FailableValidationFields): FailableResult<T> => Object.freeze([
  'v',
  Object.freeze(fields),
])

export const error = <T = never>(error: Error): FailableResult<T> => Object.freeze([
  'e',
  mapError(error),
])

export const forbidden = <T = never>(message: string): FailableResult<T> => Object.freeze([
  'f',
  message,
])
