export default class AlreadyExistsException extends Error {
  readonly path: string

  constructor(path: string, message?: string) {
    super(message)
    this.path = path
  }
}
