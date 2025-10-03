import mmmime from '@picturae/mmmagic'
import type { Mime } from '../models/fs/mime.ts'

const getMimeType = (path: string): Promise<Mime | undefined> => {
  const magic = new mmmime.Magic(mmmime.MAGIC_MIME_TYPE | mmmime.MAGIC_MIME_ENCODING)
  return new Promise((resolve, reject) => {
    magic.detectFile(path, (err, res) => {
      if (err) {
        reject(err)
      } else {
        const [mime, type] = (res ?? '').split(';')
        resolve({
          mime,
          isText: !!type && type?.split('=')[1] !== 'binary',
        })
      }
    })
  })
}

export default getMimeType
