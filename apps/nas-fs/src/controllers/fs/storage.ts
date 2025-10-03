import fs from 'node:fs/promises'
import Path from 'node:path'
import * as fsWatcher from '../../core-logic/fs/fs-watcher.ts'
import { archiveFolder } from '../../core-logic/fs/index.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Binary, ContentResponse, Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'
import BadRequestError from '../../models/errors/bad-request-error.ts'
import pathWildcardParam from '../../models/fs/path-wildcard.ts'

const schema = {
  summary: 'Gets stats and metadata of a file or folder contents',
  params: Type.Object({
    appKey: applicationKeyParam,
    '*': pathWildcardParam,
  }),
  produces: ['application/json'],
  response: {
    default: ApiErrorSchema,
    200: ContentResponse({
      'application/octet-stream': Binary({ description: 'The file contents' }),
    }, {
      description: 'The contents of a file or folder',
    }),
    304: { type: 'null', description: 'Information is fresh' },
    404: NotFoundApiErrorSchema,
  },
  tags: ['fs'],
}

const storageController: Controller<typeof schema> = async (req, reply) => {
  const { logger, storagePath } = req.appTenant!
  const path = fsWatcher.normalize(`/${req.params['*']}`)
  const fullPath = Path.join(storagePath, path)

  logger.debug({ path, fullPath, op: 'download' }, `Trying to download ${path}`)
  const stat = await fs.stat(fullPath).catch(() => null)
  if (stat == null) {
    return reply.callNotFound()
  }

  if (stat.isDirectory()) {
    logger.debug({ path, op: 'download' }, 'Using \'tar\' to archive folder')
    const acceptEncodingHeader = req.headers['accept-encoding']
    const acceptedEncodings = (acceptEncodingHeader || '')
      .split(',')
      .map((e) => e.trim())
    let compress: 'brotli' | 'zstd' | 'gzip' | 'deflate' | null = null
    if (acceptedEncodings.includes('br')) {
      compress = 'brotli'
      reply.header('Content-Encoding', 'br')
      logger.debug({ path, op: 'download' }, 'Using brotli as compression')
    } else if (acceptedEncodings.includes('zstd')) {
      compress = 'zstd'
      reply.header('Content-Encoding', 'zstd')
      logger.debug({ path, op: 'download' }, 'Using zstd as compression')
    } else if (acceptedEncodings.includes('gzip')) {
      compress = 'gzip'
      reply.header('Content-Encoding', 'gzip')
      logger.debug({ path, op: 'download' }, 'Using gzip as compression')
    } else if (acceptedEncodings.includes('deflate')) {
      compress = 'deflate'
      reply.header('Content-Encoding', 'deflate')
      logger.debug({ path, op: 'download' }, 'Using gzip as compression')
    } else {
      logger.debug({ path, op: 'download' }, 'Using identity as compression')
    }

    const tar = archiveFolder({ path: fullPath, compression: compress })
    reply.header('Content-Type', 'application/x-tar')
    reply.header('Content-Disposition', `attachment; filename="${Path.basename(fullPath)}.tar"`)

    tar.on('error', (e) => {
      logger.error(e, 'Error archiving/compressing folder', { path, op: 'download' })
      if (!reply.raw.headersSent) {
        reply.header('Content-Type', 'text/html')
        reply.removeHeader('Content-Encoding')
        reply.removeHeader('Content-Disposition')
        reply.status(500).send(`<h1>Could not compress folder</h1><br/><pre>${e.message}</pre>`)
      }
    })

    return reply.send(tar)
  }

  if (stat.isFile()) {
    return reply.download(fullPath, Path.basename(fullPath))
  }

  throw new BadRequestError('The path does not point to a file or folder')
}

storageController.options = {
  config: {
    authorization: {},
    jwt: {},
  },
  schema,
}

export default storageController
