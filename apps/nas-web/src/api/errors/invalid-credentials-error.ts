import type { BasicError } from './basic-error'

export const InvalidCredentials = 'InvalidCredentials'
export type InvalidCredentialsError = BasicError<400, typeof InvalidCredentials>
