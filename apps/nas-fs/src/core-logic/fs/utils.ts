import fs from 'node:fs/promises'
import { AlreadyExistsException, NotExistsException } from '../exceptions/index.ts'

export const ensureNotExists = (path: string) => (
  fs.access(path)
    .then(() => false)
    .catch(() => true)
    .then((res) => {
      if (!res) {
        throw new AlreadyExistsException(path, 'The path already exists')
      }
    })
)

export const ensureExists = (path: string) => (
  fs.access(path)
    .catch(() => {
      throw new NotExistsException(path, 'The path does not exist or it is not accessible')
    })
)
