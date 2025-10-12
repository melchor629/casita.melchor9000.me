import { execa } from 'execa'
import type { Mime } from '../models/fs/mime.ts'

const getMimeType = async (path: string): Promise<Mime | undefined> => {
  const result = await execa('file', ['--mime', '--extension', '--brief', path])
  const res = result.stdout ?? 'application/octet-stream; charset=binary'
  const [mime, type] = (res ?? '').split(';')
  return Promise.resolve({
    mime,
    isText: !!type && type?.split('=')[1] !== 'binary',
  })
}

export default getMimeType
