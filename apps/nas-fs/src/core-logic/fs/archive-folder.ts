import { basename } from 'node:path'
import zlib from 'node:zlib'
import tarFs from 'tar-fs'

interface ArchiveFolderOptions {
  path: string
  compression?: 'gzip' | 'brotli' | 'deflate' | 'zstd' | null
}

const archiveFolder = ({ compression, path }: ArchiveFolderOptions) => {
  const tar = tarFs.pack(path, {
    map: (headers) => ({
      ...headers,
      uid: 1000,
      gid: 1000,
      mode: ({
        directory: 0o755,
        file: 0o644,
        link: headers.mode,
        symlink: 0o777,
      })[headers.type],
    }),
    ignore: (name) => basename(name).startsWith('.'),
  })

  if (compression === 'gzip') {
    const gzip = zlib.createGzip({ level: 9 })
    return tar.pipe(gzip)
  }
  if (compression === 'brotli') {
    const br = zlib.createBrotliCompress(
      { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } },
    )
    return tar.pipe(br)
  }
  if (compression === 'deflate') {
    const deflate = zlib.createDeflate({ level: 9 })
    return tar.pipe(deflate)
  }
  if (compression === 'zstd') {
    const zstd = zlib.createZstdCompress({
      params: {
        [zlib.constants.ZSTD_c_compressionLevel]: 6,
      },
    })
    return tar.pipe(zstd)
  }

  return tar
}

export default archiveFolder
